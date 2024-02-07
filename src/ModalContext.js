import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ isModalOpen, showModal, hideModal, modalContent }}>
            {children}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                        {modalContent}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};
