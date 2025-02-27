import { useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/getContext"; // Removemos usePayment

const CheckinForOrder = ({ onSuccess }: { onSuccess: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsLoading } = useAuth();
  const [manualPaymentId, setManualPaymentId] = useState<string>("");

  const verifyPayment = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/webhooks`,
        {
          data: { id: manualPaymentId },
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Response:", response.data);
      setPaymentStatus(response.data.statusText);
      setShowModal(true);

      if (response.data.statusText === "OK") {
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setPaymentStatus("error");
      setErrorMessage("Error al verificar el pago");
      setShowModal(true);
      alert("Error\nNo se pudo verificar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPaymentStatus(null);
    setErrorMessage("");
    setManualPaymentId("");
    onSuccess(); // Llamamos directamente a onSuccess ya que sabemos que existe
  };

  return (
    <div>
      <input
        type="text"
        value={manualPaymentId}
        onChange={(e) => setManualPaymentId(e.target.value.trim())}
        placeholder="Ingrese el ID del pago"
        className="w-full p-2 border border-gray-300 rounded mt-2"
      />
      <button
        onClick={verifyPayment}
        className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Verificar Pago
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md text-center w-96">
            <h1 className="text-2xl font-bold mb-4">Estado del Pago</h1>
            {paymentStatus && (
              <p className="text-3xl font-bold mb-4">
                {(paymentStatus === "approved" || paymentStatus === "OK") ? "Pago exitoso" : "Error en el pago"}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
            <button
              onClick={handleCancel}
              className="mt-4 inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckinForOrder;
