import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/invoices`;

const handleError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      defaultMessage;
  console.error("Invoice API Error:", errorMessage);
  throw new Error(errorMessage);
};

const getAllInvoices = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to fetch invoices");
  }
};

const downloadInvoicePdf = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to download invoice PDF");
  }
};

const sendInvoiceEmail = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/send-email`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to send invoice email");
  }
};

const updateInvoiceEmail = async (id, email) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}/email`, 
      email,  
      {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to update invoice email");
  }
};

const deleteInvoice = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, "Failed to delete invoice");
  }
};

const getInvoiceById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error, "Failed to fetch invoice");
    }
  };
  
  const updateInvoice = async (id, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error, "Failed to update invoice");
    }
  };

  const createInvoice = async (invoiceData) => {
    try {
      const response = await axios.post(API_URL, invoiceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to create invoice";
      throw new Error(errorMessage);
    }
  };

export default {
  getAllInvoices,
  downloadInvoicePdf,
  sendInvoiceEmail,
  updateInvoiceEmail,
  deleteInvoice,
  getInvoiceById,
  updateInvoice,
  createInvoice
};