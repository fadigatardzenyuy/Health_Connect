import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const symptoms = [
  { id: "1", category: "General", name: "Fever", severity: "medium" },
  { id: "2", category: "General", name: "Fatigue", severity: "low" },
  { id: "3", category: "Respiratory", name: "Cough", severity: "medium" },
  {
    id: "4",
    category: "Respiratory",
    name: "Shortness of breath",
    severity: "high",
  },
  { id: "5", category: "Digestive", name: "Nausea", severity: "medium" },
  { id: "6", category: "Digestive", name: "Stomach pain", severity: "medium" },
];

export function SymptomSelector({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-md flex justify-between items-center p-2"
        aria-expanded={open}
      >
        {selectedSymptom ? selectedSymptom.name : "Select symptom..."}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          <input
            type="text"
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b border-gray-300"
          />
          {filteredSymptoms.length === 0 ? (
            <div className="p-2 text-gray-500">No symptoms found.</div>
          ) : (
            Object.entries(
              filteredSymptoms.reduce((acc, symptom) => {
                (acc[symptom.category] = acc[symptom.category] || []).push(
                  symptom
                );
                return acc;
              }, {})
            ).map(([category, categorySymptoms]) => (
              <div key={category} className="p-2">
                <h3 className="font-semibold">{category}</h3>
                {categorySymptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    onClick={() => {
                      setSelectedSymptom(symptom);
                      onSelect(symptom);
                      setOpen(false);
                    }}
                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedSymptom?.id === symptom.id ? "bg-gray-200" : ""
                    }`}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedSymptom?.id === symptom.id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {symptom.name}
                    <span
                      className={`ml-auto ${
                        symptom.severity === "high"
                          ? "text-red-500"
                          : symptom.severity === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      •
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
