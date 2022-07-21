import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Container, Row, Col } from 'react-bootstrap'

import { UserContext } from '../../context/userContext';
import NavAdmin from "../../components/NavAdmin";
import Contact from "../../components/message/Contact"
import Chat from "../../components/message/Chat"

let socket

function AdminChatPage() {
    const title = "Chat"
    document.title = "DumbMerch | " + title

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])
    const [state, dispatch] = useContext(UserContext)
    console.log(messages)

    useEffect(() => {
        socket = io('http://localhost:5050', {
            auth: {
                token: localStorage.getItem("token")
            },
            query: {
                id: state.user.id
            }
        })

        socket.on("new message", () => {
            console.log("contact", contact)
            console.log("trigered", contact?.id)
            socket.emit("load messages", contact.id)
        })

        loadContact()
        loadMessages()

        // listen error sent from server
        socket.on("connect_error", (err) => {
            console.error(err.message); // not authorized
        });

        return () => {
            socket.disconnect()
        }
    }, [messages])

    // LOAD CONTACT
    const loadContact = () => {
        // emit event to load user contact
        socket.emit("load user contacts")
    
        // listen event to get admin contact
        socket.on("user contacts", (data) => {
            console.log(data)

            let dataContacts = data.filter((item) => (item.status !== "admin") && (item.recipientMessage.length > 0 || item.senderMessage.length > 0))
            // let dataContacts = data
            dataContacts = dataContacts.map((item) => ({
                ...item,
                message: item.senderMessage.length > 0 ? item.senderMessage[item.senderMessage.length - 1].message : "Click here to start message",
            }))
            console.log(dataContacts)

            setContacts(dataContacts)
        })
    }

    // LOAD MESSAGES
    const loadMessages = (value) => {
        socket.on("messages", (data) => {
            if(data.length > 0){
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)
            }
            console.log(data)
            loadContact()

            const chatMessage = document.getElementById("chat-messages")
            chatMessage.scrollTop = chatMessage?.scrollHeight
        })
    }

    

    const clickContact = (data) => {
        console.log(data)
        setContact(data)
        socket.emit("load messages", data.id)
    }

    const sendMessage = (e) => {
        if(e.key === "Enter"){
            const data = {
                idRecipient : contact.id,
                message: e.target.value
            }

            socket.emit("send messages", data)
            e.target.value= ""
        }
    }


    return (
        <>
            <NavAdmin />
            <Container fluid style={{height: '89.5vh'}}>
                    <Row>
                        <Col md={3} style={{height: '89.5vh'}} className="px-3 border-end border-dark overflow-auto">
                            <Contact dataContact={contacts}  clickContact={clickContact} contact={contact} />
                        </Col>
                        <Col md={9} className="px-0">
                            <Chat contact={contact} messages={messages} user={state.user} sendMessage={sendMessage} />
                        </Col>
                    </Row>
            </Container>
        </>
    )
}

export default AdminChatPage