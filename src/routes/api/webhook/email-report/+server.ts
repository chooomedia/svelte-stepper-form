// src/routes/api/webhook/email-report/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPdfTemplate } from '$lib/utils/pdfGenerator';

const N8N_WEBHOOK_URL = 'https://n8n.chooomedia.com/webhook/websitehealth__done';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

/**
 * POST handler - proxy to n8n webhook
 */
export const POST: RequestHandler = async ({ request }) => {
API_KEY
      },
      body: JSON.stringify(requestData)
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from n8n webhook:', errorText);
      
      return json({
        success: false,
        message: `n8n webhook returned status ${response.status}: ${response.statusText}`,
        error: errorText
      }, { status: response.status });
    }
    
    // Parse and return the response
    const responseData = await response.json();
    
    return json({
      success: true,
      message: 'Email report request processed successfully',
      data: responseData
    });
  } catch (error) {
    console.error('Error processing email report request:', error);
    
    return json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error: String(error)
    }, { status: 500 });
  }
};