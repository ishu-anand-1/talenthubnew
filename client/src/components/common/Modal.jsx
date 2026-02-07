import { useEffect, useRef, memo } from "react";
import { X } from "lucide-react";

const Modal = ({
  open = false,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  showClose = true,
  closeOnBackdrop = true,
}) => {
  const modalRef = useRef(null);

  /* ===================== ESC KEY CLOSE ===================== */
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  /* ===================== FOCUS TRAP (BASIC) ===================== */
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* ===================== BACKDROP ===================== */}
      <div
        onClick={closeOnBackdrop ? onClose : undefined}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* ===================== MODAL CARD ===================== */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative z-10
          w-full ${maxWidth}
          bg-white dark:bg-gray-900
          rounded-2xl shadow-2xl
          p-6
          animate-fadeIn
          focus:outline-none
        `}
      >
        {/* ===================== HEADER ===================== */}
        {(title || showClose) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-800 dark:text-white"
              >
                {title}
              </h2>
            )}

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="
                  text-gray-400
                  hover:text-gray-600
                  dark:hover:text-gray-300
                  transition
                "
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* ===================== CONTENT ===================== */}
        <div className="text-gray-700 dark:text-gray-200">
          {children}
        </div>

        {/* ===================== FOOTER CLOSE (OPTIONAL) ===================== */}
        {!showClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 text-sm font-medium text-indigo-600 hover:underline"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(Modal);
