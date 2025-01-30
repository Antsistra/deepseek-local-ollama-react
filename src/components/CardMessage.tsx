type CardMessageProps = {
  role: "assistant" | "user";
  message: string;
};

export default function CardMessage({ role, message }: CardMessageProps) {
  return (
    <div
      className={`
      group flex w-full mb-4 
      ${role === "user" ? "justify-end" : "justify-start"}
    `}
    >
      <div
        className={`
        relative max-w-[80%] rounded-2xl px-4 py-3
        transition-all duration-200 ease-in-out
        hover:scale-[1.02]
        ${
          role === "user"
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100"
        }
      `}
      >
        <div className="break-words">{message}</div>
        <div
          className={`
          absolute bottom-0 ${role === "user" ? "right-0" : "left-0"}
          w-3 h-3 transform translate-y-1/2
          ${role === "user" ? "-translate-x-1" : "translate-x-1"}
          rotate-45
          ${role === "user" ? "bg-blue-600" : "bg-gray-800"}
        `}
        />
      </div>
    </div>
  );
}
