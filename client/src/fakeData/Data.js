import adminImg from "../assets/Admin.jpg";
import userImg from "../assets/Profile.jpg";

export const product = [
    {
        id: 1,
        title: "Keyboard RGB",
        description: "Keyboard RGB Gaming Wireless",
        price: "500000",
        qty: "220",
        category: "Keyboard",
        img: "https://baxtros.co.uk/wp-content/uploads/2020/10/Black-keyboard-LED-3.jpg",
    },
    {
        id: 2,
        title: "Mouse RGB",
        description: "Mouse RGB Gaming Wireless",
        price: "350000",
        qty: "100",
        category: "Mouse",
        img: "https://th.bing.com/th/id/OIP.KCPhqyxMDFXrsdI3XGG_GAHaHa?pid=ImgDet&rs=1",
    },
    {
        id: 3,
        title: "Bag Eiger",
        description: "Mouse RGB Gaming Wireless",
        price: "250000",
        qty: "149",
        category: "Bag",
        img: "https://s2.bukalapak.com/img/7899451071/w-1000/Tas_Selempang_Eiger_Shoulder_Bag_Expend_Black.jpg",
    },
];

export const transaction = [
    {
        id: 1,
        idTransaction: 20 + Math.random() * 25,
        title: "Mouse RGB",
        img: "https://th.bing.com/th/id/OIP.KCPhqyxMDFXrsdI3XGG_GAHaHa?pid=ImgDet&rs=1",
        date: "2022-07-05",
        price: "350000",
        subTotal: "350.000",
    },
    {
        id: 2,
        idTransaction: 20 + Math.random() * 25,
        title: "Keyboard RGB",
        img: "https://baxtros.co.uk/wp-content/uploads/2020/10/Black-keyboard-LED-3.jpg",
        date: "2022-06-21",
        price: "500000",
        subTotal: "500.000",
    },
];

export const category = [
    {
        id: 1,
        title: "Keyboard",
    },
    {
        id: 2,
        title: "Mouse",
    },
    {
        id: 3,
        title: "Bag",
    },
    {
        id: 4,
        title: "Monitor",
    },
    {
        id: 5,
        title: "Headset",
    },
];

export const account = [
    {
        id: 1,
        name: "Alamanda Rahamwati",
        email: "al@mail.com",
        password: "1212",
        img: adminImg,
        gender: "Female",
        phone: "0856-1320-1212",
        address:
            "Jalan Godean No. 11, RT 50 / RW 21, Slemean, Yogyakarta 55731",
        role: "admin",
    },
    {
        id: 3,
        name: "Hilal Akbar",
        email: "hilal@mail.com",
        password: "hil121202",
        img: userImg,
        phone: "0856-1320-1212",
        gender: "Male",
        address:
            "Jalan Peta No. 121, RT 02 / RW 01, Balokang, Banjar, Jawa Barat 46312",
        role: "user",
    },
];

export const contact = [
    {
        id: 1,
        name: "Customer 1",
        chat: "Yes, Is there anything I can help",
        img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHVzZXJ8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
        id: 2,
        name: "Customer 2",
        chat: "Yes, Is there anything I can help",
        img: "https://images.unsplash.com/photo-1604607055958-4def78942d6e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fHVzZXJ8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
];
