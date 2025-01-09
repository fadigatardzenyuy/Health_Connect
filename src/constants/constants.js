import { doctor, doctor2, doctor3, doctor4, doctor5, doctor6, logo, video } from "../Assets/images";

// Helper function to get a random doctor image
const getRandomDoctorImage = () => {
    const doctorImages = [doctor, doctor2, doctor3, doctor4, doctor5, doctor6];
    return doctorImages[Math.floor(Math.random() * doctorImages.length)];
};

export const posts = [
    {
        id: 1,
        author: "John Doe",
        avatar: getRandomDoctorImage(),
        content: "I've been experiencing frequent headaches lately. Any advice on natural remedies?",
        image: getRandomDoctorImage(),
        timestamp: "2023-05-15 10:30 AM",
        likes: 24,
        comments: 5,
        shares: 2,
        isDoctor: false
    },
    {
        id: 2,
        author: "Dr. Sarah Johnson",
        avatar: getRandomDoctorImage(),
        content: "New video: '5 Easy Exercises for Better Posture'. Check it out and start improving your posture today!",
        video: video,
        timestamp: "2023-05-14 2:45 PM",
        likes: 56,
        comments: 12,
        shares: 8,
        isDoctor: true,
        verified: true
    },
    {
        id: 3,
        author: "Emily Chen",
        avatar: getRandomDoctorImage(),
        content: "Can anyone recommend a good diet plan for managing type 2 diabetes?",
        timestamp: "2023-05-13 4:20 PM",
        likes: 18,
        comments: 3,
        shares: 1,
        isDoctor: false
    },
    {
        id: 4,
        author: "Dr. Michael Okonkwo",
        avatar: getRandomDoctorImage(),
        content: "Just published a new article on stress management techniques. Swipe to read!",
        image: getRandomDoctorImage(),
        timestamp: "2023-05-12 11:15 AM",
        likes: 72,
        comments: 15,
        shares: 20,
        isDoctor: true,
        verified: true
    },
    {
        id: 5,
        author: "Lisa Nguyen",
        avatar: getRandomDoctorImage(),
        content: "I'm struggling with insomnia. Any tips for improving sleep quality?",
        timestamp: "2023-05-11 3:00 PM",
        likes: 31,
        comments: 7,
        shares: 4,
        isDoctor: false
    },
    {
        id: 6,
        author: "Dr. Aisha Bello",
        avatar: getRandomDoctorImage(),
        content: "New study shows the benefits of meditation for heart health. Here's a quick guide to get started:",
        image: getRandomDoctorImage(),
        timestamp: "2023-05-10 9:45 AM",
        likes: 45,
        comments: 8,
        shares: 12,
        isDoctor: true,
        verified: true
    },
    {
        id: 7,
        author: "Mark Thompson",
        avatar: getRandomDoctorImage(),
        content: "Looking for advice on managing seasonal allergies. What works best for you?",
        image: getRandomDoctorImage(),
        timestamp: "2023-05-09 1:30 PM",
        likes: 29,
        comments: 6,
        shares: 3,
        isDoctor: false
    },
    {
        id: 8,
        author: "Dr. Fatima Hassan",
        avatar: getRandomDoctorImage(),
        content: "Join me for a live Q&A session on women's health tomorrow at 7 PM. Don't miss it!",
        timestamp: "2023-05-08 5:15 PM",
        likes: 63,
        comments: 14,
        shares: 9,
        isDoctor: true,
        verified: true
    },
    {
        id: 9,
        author: "David Lee",
        avatar: getRandomDoctorImage(),
        content: "New video: 'Understanding Blood Pressure Readings'. Learn how to interpret your numbers and take control of your health.",
        video: "https://example.com/blood-pressure-video.mp4",
        timestamp: "2023-05-07 11:00 AM",
        likes: 52,
        comments: 10,
        shares: 15,
        isDoctor: false
    },
    {
        id: 10,
        author: "Dr. Olivia Martinez",
        avatar: getRandomDoctorImage(),
        content: "Quick tip: Stay hydrated! Adequate water intake can improve energy levels, skin health, and overall well-being.",
        image: getRandomDoctorImage(),
        timestamp: "2023-05-06 3:45 PM",
        likes: 87,
        comments: 19,
        shares: 25,
        isDoctor: true,
        verified: true
    }
];





export const doctors = [
    {
        doctor: doctor,
    },
    {
        doctor: doctor2,
    },
    {
        doctor: doctor3,
    },
    {
        doctor: doctor4,
    },
    {
        doctor: doctor5,
    },
    {
        doctor: doctor6,
    },
    {
        logo: logo,
    }
]
export const friends = [
    {
        id: 1,
        name: "John Doe",
        image: getRandomDoctorImage(),
        status: "online",
    },
    {
        id: 2,
        name: "Jane Smith",
        image: getRandomDoctorImage(),
        status: "offline",
    },
    {
        id: 3,
        name: "Mike Johnson",
        image: getRandomDoctorImage(),
        status: "online",
    },
    {
        id: 4,
        name: "Emily Brown",
        image: getRandomDoctorImage(),
        status: "offline",
    },
    {
        id: 5,
        name: "Alex Wilson",
        image: getRandomDoctorImage(),
        status: "online",
    },
];

export const slides = [
    {
        id: 1,
        text: "Our Services",
        description:
            "Cameroon Health Connect aims to improve accessibility to all your health and wellness needs. Connect to General Parctitioners on demand.",
        image: doctor2,
    },
    {
        id: 2,
        text: "Video call a healthcare doctor now",
        description:
            "Skip the queue. Get the advice you need from the comfort of your home instantly. You can also schedule an appointment with your preferred provider at your convenience.",
        image: doctor3,
    },
    {
        id: 3,
        text: "We've got you covered - from medication to referrals ",
        description:
            "Supporting documents will be sent straight to your inbox when necessary.",
        image: doctor4,
    },
];

