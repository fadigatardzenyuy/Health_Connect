import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Phone,
  Video,
  MessageCircle,
  Mic,
  MicOff,
  VideoOff,
  Send,
} from "lucide-react";

export default function VideoConsultations() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Doctor", text: "Hello, how are you feeling today?" },
    { id: 2, sender: "Patient", text: "Im feeling better, thank you." },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);

  const consultations = [
    { id: 1, name: "Patient 1", time: "10:00 AM", type: "Video Consultation" },
    { id: 2, name: "Patient 2", time: "11:30 AM", type: "Video Consultation" },
    { id: 3, name: "Patient 3", time: "02:00 PM", type: "Video Consultation" },
  ];

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), sender: "Doctor", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleCall = () => {
    setIsCallActive(!isCallActive);
    if (!isCallActive) {
      setTimer(0);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Video Consultations
        </h1>
        <p className="text-gray-600">Manage your video consultations</p>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                {isVideoOff ? (
                  <Typography className="text-gray-400">
                    Video is turned off
                  </Typography>
                ) : (
                  <Typography className="text-gray-400">
                    Video preview will appear here
                  </Typography>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Typography variant="h6">
                  {isCallActive
                    ? `Call Duration: ${formatTime(timer)}`
                    : "Ready to start call"}
                </Typography>
                <div className="flex space-x-2">
                  <IconButton
                    onClick={() => setIsMuted(!isMuted)}
                    color={isMuted ? "secondary" : "primary"}
                  >
                    {isMuted ? <MicOff /> : <Mic />}
                  </IconButton>
                  <IconButton
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    color={isVideoOff ? "secondary" : "primary"}
                  >
                    {isVideoOff ? <VideoOff /> : <Video />}
                  </IconButton>
                  <Button
                    variant="contained"
                    color={isCallActive ? "secondary" : "primary"}
                    onClick={toggleCall}
                  >
                    {isCallActive ? "End Call" : "Start Call"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent className="h-[calc(100vh-16rem)] flex flex-col">
              <Typography variant="h6" className="mb-4">
                Chat
              </Typography>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "Doctor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "Doctor"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <IconButton type="submit" color="primary">
                  <Send />
                </IconButton>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="mt-6">
        <CardContent>
          <Typography variant="h6" className="mb-4">
            Upcoming Consultations
          </Typography>
          <Grid container spacing={3}>
            {consultations.map((consultation) => (
              <Grid item xs={12} sm={6} md={4} key={consultation.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" className="font-medium">
                      {consultation.name}
                    </Typography>
                    <Typography color="textSecondary">
                      {consultation.type}
                    </Typography>
                    <Typography color="textSecondary" className="mb-4">
                      {consultation.time}
                    </Typography>
                    <div className="flex space-x-2">
                      <Button
                        variant="outlined"
                        startIcon={<Phone />}
                        size="small"
                        fullWidth
                      >
                        Call
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Video />}
                        size="small"
                        fullWidth
                      >
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
