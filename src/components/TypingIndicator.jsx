export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
      </div>
      <span className="text-sm text-blue-600">AI Assistant is typing...</span>
    </div>
  );
}
