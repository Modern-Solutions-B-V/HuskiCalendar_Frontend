import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import '../style/Calend.css';
import Layout from "../components/Layout";
import { Scrollbars } from 'react-custom-scrollbars';
import { isWithinInterval, format } from 'date-fns';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Lundi (1) comme premier jour
    getDay,
    locales,
});



const EventComponent = ({ event, currentView }) => {
    let content = null;


    switch (currentView) {
        case "month":
            content = (
                <div className="event-content">
                    <Scrollbars style={{ height: 40 }}>

                        <p className="event-title"><b>{event.title}</b></p>

                    </Scrollbars>
                </div>
            );
            break;
        case "week":
            content = (
                <div className="event-content">
                    <Scrollbars style={{ height: 64 }}>
                        {event.booking_elements
                            ?.sort((a, b) => new Date(a.startdate) - new Date(b.startdate))
                            .map((element, index) => {
                                const overlappingElements = event.booking_elements.filter(
                                    otherElement =>
                                        (element.starttime >= otherElement.starttime && element.starttime <= otherElement.endtime) ||
                                        (element.endtime >= otherElement.starttime && element.endtime <= otherElement.endtime) ||
                                        (element.starttime <= otherElement.starttime && element.endtime >= otherElement.endtime)
                                );

                                // Vérifier si cet élément se superpose à d'autres
                                const overlaps = overlappingElements.length > 1;

                                return (
                                    <div
                                        key={index}
                                        className={`booking-element ${overlaps ? 'overlapping' : ''}`}
                                    >
                                        <p className="element-tittle">
                                            <b>{element.element_name}</b>
                                        </p>
                                        <p className="event-place">
                                            {element.starttime.toLocaleString()} - {element.endtime.toLocaleString()}
                                        </p>
                                    </div>
                                );
                            })}
                    </Scrollbars>
                </div>
            );
            break;
        case "day":
            content = (
                <div className="event-content">
                    <Scrollbars style={{ height: 72 }}>
                        {event.booking_elements?.map((element, index) => (
                            <div key={index} className="booking-element">
                                <p className="element-tittle"><b>{element.element_name}</b></p>
                                <p className="event-place">{element.starttime.toLocaleString()} - {element.endtime.toLocaleString()}</p>
                            </div>
                        ))}
                    </Scrollbars>
                </div>
            );
            break;
        default:
            content = (
                <div className="event-content">
                    <p className="eventtitle"><b>{event.title}</b></p>
                </div>
            );
    }

    return content;
};

const Calend = () => {
    const [events, setEvents] = useState([]);
    const [currentView, setCurrentView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [SelectedEvent, setSelectedEvent] = useState("");
    const handleViewChange = (newView) => {
        setCurrentView(newView);
    };
    let startDate = startOfWeek(currentDate);
    let endDate = endOfWeek(currentDate);


    const [showModal, setShowModal] = useState(false);
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };


    const handleCloseModal = () => {
        setShowModal(false);
    };
    const role = localStorage.getItem('role')

    useEffect(() => {
        let startDate, endDate;

        switch (currentView) {
            case "month":
                startDate = startOfMonth(currentDate);
                endDate = endOfMonth(currentDate);
                break;
            case "week":
                startDate = startOfWeek(currentDate);
                endDate = endOfWeek(currentDate);
                break;
            case "day":
                startDate = startOfDay(currentDate);
                endDate = endOfDay(currentDate);
                break;
            default:
                startDate = startOfMonth(currentDate);
                endDate = endOfMonth(currentDate);
                break;
        }


        axios.get(`http://localhost:5000/booking/getBookingsByDateRange`, {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            }
        })
            .then((response) => {
                const bookingEvents = response.data.map((booking) => ({
                    title: booking.trip_name,
                    start: new Date(booking.startdate),
                    end: new Date(booking.enddate),
                    deptor_place: booking.deptor_place,
                    summary: booking.summary,
                    status_code: booking.status_code,
                    number: booking.number,
                    company_name: booking.company_name,
                    contact_first_name: booking.contact_first_name,

                    bookingelements: booking.booking_elements.map((element) => ({
                        element_name: element.element_name,
                        start: new Date(element.startdate),
                        end: new Date(element.enddate),
                        starttime: element.starttime,
                        endtime: element.endtime,
                        supplier_place: element.supplier_place,

                    })),

                }));
                setEvents(bookingEvents);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des réservations :", error);
            });
    }, [currentDate, currentView]);

    const clickRef = useRef(null);
    const onDoubleClickEvent = useCallback((calEvent) => {

        window.clearTimeout(clickRef?.current)
        clickRef.current = window.setTimeout(() => {
            window.alert(calEvent, 'onDoubleClickEvent')
        })
    }, [])

    const customDayFormat = (date, culture, localizer) => {
        const formattedDate = localizer.format(date, 'dd/MM/yyyy', culture);
        const dayOfWeek = localizer.format(date, 'EEEE', culture);
        return `${dayOfWeek} ${formattedDate}`;
    };



    return (
        <>

            <div className="container-fluid">
                <div className="row">
                    {currentView === "week" && (
                        <div className="col pt-md-5 mt-md-5 mt-lg-0 pt-lg-5 d-none d-md-block me-0 pe-0">
                            <div className="rbc-header">
                                <span>Event</span>
                            </div>
                            {events
                                .filter((event) => {
                                    startDate = startOfWeek(currentDate);
                                    endDate = endOfWeek(currentDate);
                                    return isWithinInterval(event.start, { start: startDate, end: endDate });
                                })
                                .sort((eventA, eventB) => eventA.start - eventB.start) // Tri par date croissante
                                .map((event) => (
                                    <div key={event.id} className="eventalista">
                                        <div className="rbc-row-content-scroll-container">
                                            <h6 className="eventtitla" style={{ textDecoration: 'underline' }}>{event.title}</h6 >
                                            <h6 className="eventtitla" style={{ backgroundColor: 'yellow' }}>Status: {event.status_code}</h6 >
                                            <h6 className="eventtitla">{`${format(event.start, 'dd/MMM/yyyy')}-${format(event.end, 'dd/MMM/yyyy')}`}</h6 >
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                    {currentView === "day" && (
                        <div className="col pt-md-5 mt-md-5 mt-lg-0 pt-lg-5 d-none d-md-block me-0 pe-0">
                            <div className="rbc-header">
                                <span>Event</span>
                            </div>
                            {events
                                .filter((event) => {
                                    startDate = startOfWeek(currentDate);
                                    endDate = endOfWeek(currentDate);
                                    return isWithinInterval(event.start, { start: startDate, end: endDate });
                                })
                                .sort((eventA, eventB) => eventA.start - eventB.start) // Tri par date croissante
                                .map((event) => (
                                    <div key={event.id} className="eventalista">
                                        <div className="rbc-row-content-scroll-container">
                                            <h6 className="eventtitla" style={{ textDecoration: 'underline' }}>{event.title}</h6 >
                                            <h6 className="eventtitla" style={{ backgroundColor: 'yellow' }}>Status: {event.status_code}</h6 >
                                            <h6 className="eventtitla">{`${format(event.start, 'dd/MMM/yyyy')}-${format(event.end, 'dd/MMM/yyyy')}`}</h6 >
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}


                    <div className={currentView !== "month" && currentView !== "agenda" ? "col-md-8 pt-md-3 pt-lg-1 ms-0 ps-0 " : "col "}>
                        <Calendar
                            formats={{
                                dayFormat: (date, culture, localizer) =>
                                    customDayFormat(date, culture, localizer),
                            }}
                            localizer={localizer}
                            events={events.map((booking) => ({
                                ...booking,

                                booking_elements: booking.bookingelements.map((element) => ({
                                    element_name: element.element_name,
                                    start: new Date(element.startdate),
                                    end: new Date(element.enddate),
                                    starttime: element.starttime,
                                    endtime: element.endtime,
                                    supplier_place: element.supplier_place,

                                })),
                            }))}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 1000 }}
                            components={{ event: (eventProps) => <EventComponent {...eventProps} currentView={currentView} /> }}
                            onView={handleViewChange}
                            onNavigate={(newDate) => setCurrentDate(newDate)}
                            onSelectEvent={(event) => handleSelectEvent(event)}
                            showAllEvents
                            onDoubleClickEvent={onDoubleClickEvent}


                        />

                    </div>
                </div>



            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{SelectedEvent.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="event-details-label">Booking:</div>
                    <div className="event-details-value">{SelectedEvent.number}</div>
                    <div className="event-details-label">Company Name:</div>
                    <div className="event-details-value">{SelectedEvent.company_name}</div>
                    <div className="event-details-label">Deptor Place:</div>
                    <div className="event-details-value">{SelectedEvent.deptor_place}</div>
                    {SelectedEvent.bookingelements?.length > 0 && (
                        <div className="event-details-bookingelements-container">
                            <h3>Activities Details</h3>
                            {SelectedEvent.bookingelements.map((element, index) => (
                                <div key={index} className="event-details-bookingelement">
                                    <p className="event-details-bookingelement-name">{element.element_name}</p>
                                    <div className="event-details-bookingelement-details">
                                        <div className="event-details-bookingelement-detail">
                                            <label>Start:</label>
                                            <span>{element.start.toLocaleString()}</span>
                                        </div>

                                        <div className="event-details-bookingelement-detail">
                                            <label>End:</label>
                                            <span>{element.end.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="event-details-bookingelement-details">
                                        <div className="event-details-bookingelement-detail">
                                            <label>Starttime:</label>
                                            <span>{element.starttime.toLocaleString()}</span>
                                        </div>

                                        <div className="event-details-bookingelement-detail">
                                            <label>EndTime:</label>
                                            <span>{element.endtime.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="event-details-bookingelement-detail">
                                        <label>Supplier Place:</label>
                                        <span>{element.supplier_place || "None"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Calend; 
