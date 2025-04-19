// src/lib/utils/api.js
const API_BASE_URL = 'https://simple-survey-api-james.vercel.app'; // Ensure this matches your FastAPI backend URL

/**
 * Fetch survey questions from the API
 * @returns {Promise<{question: App.Question[]}>} Survey questions array nested under 'question' key
 */
export async function fetchQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/questions`);
    if (!response.ok) {
       const errorText = await response.text();
       console.error("API Error Response:", errorText);
      throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }
    // The API returns { "question": [...] }, so we expect that structure
    const data = await response.json();
    if (!data || !Array.isArray(data.question)) {
        console.error("Unexpected API response structure:", data);
        throw new Error("Invalid data structure received for questions.");
    }
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error; // Re-throw to be caught by the component
  }
}

/**
 * Submit survey response to the API
 * @param {FormData} formData - Form data including file uploads
 * @returns {Promise<App.QuestionResponse>} Submitted response data
 */
export async function submitSurveyResponse(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/questions/responses`, {
      method: 'PUT',
      body: formData,
      // Browser sets Content-Type automatically for FormData with boundary
    });

    if (!response.ok) {
      let errorDetail = `Failed to submit response: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorDetail; // Use FastAPI detail if available
      } catch (e) {
         // If response is not JSON, use the original error text
         const errorText = await response.text();
         errorDetail = errorText || errorDetail;
      }
      console.error("Submission Error:", errorDetail);
      throw new Error(errorDetail);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting survey response:', error);
    throw error;
  }
}

/**
 * Fetch survey responses with pagination and filtering
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Items per page
 * @param {string|null} emailFilter - Optional email filter
 * @returns {Promise<App.QuestionResponseList>} Survey responses with pagination data
 */
export async function fetchResponses(page = 1, pageSize = 10, emailFilter = null) {
  try {
    const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
    });
    if (emailFilter) {
      params.append('email_address', emailFilter);
    }

    const url = `${API_BASE_URL}/api/questions/responses?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
       const errorText = await response.text();
       console.error("API Error Response:", errorText);
      throw new Error(`Failed to fetch responses: ${response.status} ${response.statusText}`);
    }
     const data = await response.json();
     if (!data || !data.question_response) {
         console.error("Unexpected API response structure:", data);
         throw new Error("Invalid data structure received for responses.");
     }
    return data;
  } catch (error) {
    console.error('Error fetching responses:', error);
    throw error;
  }
}

/**
 * Get the URL to download a certificate by ID
 * This doesn't fetch the file itself, just provides the URL for an <a> tag
 * @param {number} id - Certificate ID
 * @returns {string} URL for downloading the certificate
 */
export function getCertificateDownloadUrl(id) {
  return `${API_BASE_URL}/api/questions/responses/certificates/${id}`;
}