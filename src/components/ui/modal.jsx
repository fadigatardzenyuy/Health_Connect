// components/ui/Modal.jsx
import { Dialog } from "@headlessui/react";
import { useState } from "react";

export function Modal({ isOpen, onClose, children }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-lg mx-auto shadow-lg">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
