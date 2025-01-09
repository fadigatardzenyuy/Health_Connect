export const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        avatar: '/placeholder.svg',
        status: 'online',
        phoneNumber: '+1234567890',
        bio: 'Hello, I am using WhatsClone!',
    },
    {
        id: '2',
        name: 'Jane Smith',
        avatar: '/placeholder.svg',
        status: 'offline',
        phoneNumber: '+0987654321',
        bio: 'Busy',
    },
    // Add more mock users as needed
];

export const mockChats = [
    {
        id: '1',
        type: 'individual',
        name: 'Jane Smith',
        participants: [mockUsers[0], mockUsers[1]],
        messages: [
            {
                id: '1',
                chatId: '1',
                senderId: '2',
                content: 'Hey, how are you?',
                timestamp: new Date(Date.now() - 3600000),
                status: 'read',
                type: 'text',
            },
            {
                id: '2',
                chatId: '1',
                senderId: '1',
                content: 'I\'m good, thanks! How about you?',
                timestamp: new Date(Date.now() - 3540000),
                status: 'read',
                type: 'text',
            },
        ],
        unreadCount: 0,
        muted: false,
        pinned: false,
    },
    // Add more mock chats as needed
];

export const mockStatusUpdates = [
    {
        id: '1',
        userId: '1',
        content: 'Hello, world!',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000),
        expiresAt: new Date(Date.now() + 86400000),
        viewedBy: [],
    },
    // Add more mock status updates as needed
];