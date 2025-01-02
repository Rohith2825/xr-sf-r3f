import { create } from "zustand";

type InfoModalStore = {
  isInfoModalOpen: boolean;
  openInfoModal: () => void;
  closeInfoModal: () => void;
};

type InfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const useInfoModalStore = create<InfoModalStore>((set) => ({
  isInfoModalOpen: false,
  openInfoModal: () => set({ isInfoModalOpen: true }),
  closeInfoModal: () => set({ isInfoModalOpen: false }),
}));

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-80" onClick={onClose}></div>
      <div className="bg-black bg-opacity-80 p-8 rounded-2xl max-w-2xl w-full mx-4 relative z-10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          ✕
        </button>
        <h2 className="text-white text-2xl font-bold mb-6">Privacy & Terms</h2>
        <div className="text-white space-y-4">
          <p className="text-lg">Welcome to our 3D Experience</p>
          <p>By using this 3D experience, you agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your movement data being collected for experience optimization</li>
            <li>Cookie usage for preserving your preferences</li>
            <li>Browser storage for maintaining session state</li>
          </ul>
          <p>We prioritize your privacy and only collect necessary data to improve your experience.</p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;