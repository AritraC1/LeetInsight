"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface PrivacyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPopup({ isOpen, onClose }: PrivacyPopupProps) {
  // Close on Escape + prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background page from scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore previous body overflow
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Privacy Popup */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-90 max-h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-[#202020] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-white text-lg font-bold">Privacy Policy</h1>

          <button
            onClick={onClose}
            aria-label="Close privacy policy"
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(70vh-64px)] overflow-y-auto px-4 pb-5 pr-3 scrollbar-thin scrollbar-thumb-[#fc8a23] scrollbar-track-transparent">
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Welcome to our platform. Your privacy is important to us, and we are
            committed to being transparent about how we handle your information.
            This Privacy Policy outlines our practices regarding the collection,
            use, and storage of data—specifically clarifying that we do{" "}
            <strong className="text-white">not</strong> collect or store
            usernames in real-time.
          </p>

          <section className="mb-6">
            <h2 className="text-white text-base mb-2 font-semibold">
              Information We Do Not Collect
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              We do <strong className="text-white">not</strong> collect, store,
              or track usernames or any personally identifiable information
              (PII) in real-time when you interact with our platform. Your
              activity remains anonymous, and no identifying information is
              stored on our servers.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-white text-base mb-2 font-semibold">
              How We Use Your Interaction Data
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              While usernames are not collected or stored, we may analyze{" "}
              <em>non-identifiable</em> usage patterns (e.g., general
              interaction logs, feature usage, anonymized metrics) to:
            </p>

            <ul className="list-disc list-inside text-gray-300 text-sm mt-3 space-y-2">
              <li>
                <strong className="text-white">Improve User Experience:</strong>{" "}
                Understand how users interact with our platform in order to make
                it better.
              </li>

              <li>
                <strong className="text-white">
                  Support Educational and Research Goals:
                </strong>{" "}
                Use aggregate, non-personal data for academic, development, or
                research purposes.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-white text-base mb-2 font-semibold">
              Data Security
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Although we do not store usernames, we are committed to securing
              any general interaction data that may be temporarily processed. We
              employ appropriate safeguards to protect the integrity and
              confidentiality of all data we handle.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-white text-base mb-2 font-semibold">
              No Data Sharing
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Since we do not collect usernames, there is no data to share,
              sell, or rent to third parties for marketing or other purposes.
              Any insights derived from anonymized data are used internally or
              for educational purposes only.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-white text-base mb-2 font-semibold">
              Your Consent
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              By using our platform, you acknowledge and agree to this Privacy
              Policy. If our data practices change in the future, we will update
              this policy and notify users accordingly.
            </p>
          </section>

          <section>
            <h2 className="text-white text-base mb-2 font-semibold">
              Contact Us
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please ping
              me on Twitter (Now X).
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
