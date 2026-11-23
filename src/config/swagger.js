const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Smart Task & Weather Planner API',
    version: '1.0.0',
    description:
      'RESTful API with JWT authentication, relational SQLite storage, and live Open-Meteo weather enrichment.'
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste the JWT token returned from /auth/login or /auth/register'
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'API health check',
        responses: {
          200: { description: 'Server is healthy and running' }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Maryam Akbar' },
                  email: { type: 'string', example: 'maryam.demo@figzol.com' },
                  password: { type: 'string', example: 'Password@2026' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered and JWT issued' },
          400: { description: 'Missing or invalid fields' },
          409: { description: 'Email already registered' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'maryam.demo@figzol.com' },
                  password: { type: 'string', example: 'Password@2026' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful with JWT token' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current logged-in user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Authenticated user profile' },
          401: { description: 'Missing or invalid JWT token' }
        }
      }
    },
    '/plans': {
      post: {
        tags: ['Plans'],
        summary: 'Create a location-tagged plan with live Open-Meteo weather',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'city', 'plan_date'],
                properties: {
                  title: { type: 'string', example: 'Client Architecture Review' },
                  city: { type: 'string', example: 'Lahore' },
                  plan_date: { type: 'string', example: '2026-11-28' },
                  notes: { type: 'string', example: 'Demonstrate MVC structure and live weather enrichment' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Plan created with live weather data' },
          400: { description: 'Missing required fields' },
          401: { description: 'Unauthorized' },
          404: { description: 'City not found by geocoding service' }
        }
      },
      get: {
        tags: ['Plans'],
        summary: 'Get all plans belonging to the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of user plans' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/plans/{id}': {
      get: {
        tags: ['Plans'],
        summary: 'Get a single plan by ID with refreshed live weather',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          200: { description: 'Plan details and fresh weather snapshot' },
          401: { description: 'Unauthorized' },
          404: { description: 'Plan not found' }
        }
      },
      put: {
        tags: ['Plans'],
        summary: 'Update a plan (auto-refreshes weather if city changes)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Updated Sprint Sync' },
                  city: { type: 'string', example: 'London' },
                  plan_date: { type: 'string', example: '2026-12-05' },
                  notes: { type: 'string', example: 'Updated city triggers fresh weather lookup' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Plan updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Plan not found' }
        }
      },
      delete: {
        tags: ['Plans'],
        summary: 'Delete a plan by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          200: { description: 'Plan deleted successfully' },
          401: { description: 'Unauthorized' },
          404: { description: 'Plan not found' }
        }
      }
    }
  }
};

export default swaggerSpec;
