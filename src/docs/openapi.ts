import { APP_MESSAGES } from "../common/messages";

const schemaRef = (name: string) => ({
  $ref: `#/components/schemas/${name}`,
});

const successResponse = (description: string, message: string, dataSchema?: Record<string, unknown>) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: message,
          },
          ...(dataSchema
            ? {
                data: dataSchema,
              }
            : {}),
        },
        required: dataSchema ? ["success", "message", "data"] : ["success", "message"],
      },
    },
  },
});

const errorResponse = (description: string, status: number, message: string) => ({
  description,
  content: {
    "application/json": {
      schema: schemaRef("ErrorResponse"),
      examples: {
        default: {
          value: {
            success: false,
            message,
            error: {
              status,
            },
          },
        },
      },
    },
  },
});

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "PHARMA 221 API",
    version: "1.0.0",
    description:
      "Documentation Swagger de l'API Express de gestion de pharmacie: auth, clients, fournisseurs, medicaments et ventes.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Serveur courant",
    },
    {
      url: "https://pharmacie-221.onrender.com/api/v1",
      description: "Production Render",
    },
  ],
  tags: [
    { name: "Health", description: "Disponibilite du service" },
    { name: "Auth", description: "Authentification" },
    { name: "Clients", description: "Gestion des clients" },
    { name: "Fournisseurs", description: "Gestion des fournisseurs" },
    { name: "Medicaments", description: "Gestion des medicaments" },
    { name: "Ventes", description: "Gestion des ventes" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: APP_MESSAGES.SERVER_ERROR },
          error: {
            oneOf: [
              { type: "object", additionalProperties: true },
              { type: "array", items: { type: "string" } },
              { type: "string" },
              { type: "null" },
            ],
            nullable: true,
          },
          stack: { type: "string", nullable: true },
        },
        required: ["success", "message"],
      },
      HealthData: {
        type: "object",
        properties: {
          service: { type: "string", example: "GestPharmacie API" },
          status: { type: "string", example: "ok" },
        },
        required: ["service", "status"],
      },
      AuthUser: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", example: "admin@pharma221.sn" },
          role: { type: "string", example: "ADMIN" },
        },
        required: ["email", "role"],
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: schemaRef("AuthUser"),
        },
        required: ["token", "user"],
      },
      CurrentUser: {
        type: "object",
        properties: {
          id: { type: "string", format: "email", example: "admin@pharma221.sn" },
          role: { type: "string", example: "ADMIN" },
        },
        required: ["id", "role"],
      },
      LoginInput: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", example: "admin@pharma221.sn" },
          password: { type: "string", minLength: 6, example: "secret123" },
        },
        required: ["email", "password"],
      },
      VenteCount: {
        type: "object",
        properties: {
          ventes: { type: "integer", example: 0 },
        },
        required: ["ventes"],
      },
      MedicamentCount: {
        type: "object",
        properties: {
          medicaments: { type: "integer", example: 0 },
        },
        required: ["medicaments"],
      },
      Client: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          prenom: { type: "string", example: "Pape" },
          nom: { type: "string", example: "Teuw" },
          telephone: { type: "string", example: "770000000" },
          email: { type: "string", format: "email", example: "pape@pharma221.sn" },
          adresse: { type: "string", nullable: true, example: "Dakar" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          ventes: {
            type: "array",
            items: schemaRef("Vente"),
          },
          _count: schemaRef("VenteCount"),
        },
        required: [
          "id",
          "prenom",
          "nom",
          "telephone",
          "email",
          "createdAt",
          "updatedAt",
          "ventes",
          "_count",
        ],
      },
      CreateClientInput: {
        type: "object",
        properties: {
          prenom: { type: "string", minLength: 2, example: "Pape" },
          nom: { type: "string", minLength: 2, example: "Teuw" },
          telephone: { type: "string", minLength: 2, example: "770000000" },
          email: { type: "string", format: "email", example: "pape@pharma221.sn" },
          adresse: { type: "string", example: "Dakar" },
        },
        required: ["prenom", "nom", "telephone", "email"],
      },
      UpdateClientInput: {
        allOf: [
          schemaRef("CreateClientInput"),
          {
            type: "object",
            minProperties: 1,
          },
        ],
      },
      Fournisseur: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          code: { type: "string", example: "FOU-001" },
          nom: { type: "string", example: "Laborex" },
          adresse: { type: "string", example: "Dakar" },
          telephone: { type: "string", nullable: true, example: "781112233" },
          email: { type: "string", format: "email", example: "contact@laborex.sn" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          medicaments: {
            type: "array",
            items: schemaRef("Medicament"),
          },
          _count: schemaRef("MedicamentCount"),
        },
        required: [
          "id",
          "code",
          "nom",
          "adresse",
          "email",
          "createdAt",
          "updatedAt",
          "medicaments",
          "_count",
        ],
      },
      CreateFournisseurInput: {
        type: "object",
        properties: {
          code: { type: "string", minLength: 2, example: "FOU-001" },
          nom: { type: "string", minLength: 2, example: "Laborex" },
          adresse: { type: "string", minLength: 3, example: "Dakar" },
          telephone: { type: "string", minLength: 2, example: "781112233" },
          email: { type: "string", format: "email", example: "contact@laborex.sn" },
        },
        required: ["code", "nom", "adresse", "email"],
      },
      UpdateFournisseurInput: {
        allOf: [
          schemaRef("CreateFournisseurInput"),
          {
            type: "object",
            minProperties: 1,
          },
        ],
      },
      Medicament: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          code: { type: "string", example: "MED-001" },
          libelle: { type: "string", example: "Paracetamol" },
          prix: { type: "number", format: "float", example: 1500 },
          qteStock: { type: "integer", example: 25 },
          dateExpiration: { type: "string", format: "date-time" },
          fournisseurId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          fournisseur: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              code: { type: "string", example: "FOU-001" },
              nom: { type: "string", example: "Laborex" },
            },
            required: ["id", "code", "nom"],
          },
          _count: schemaRef("VenteCount"),
        },
        required: [
          "id",
          "code",
          "libelle",
          "prix",
          "qteStock",
          "dateExpiration",
          "fournisseurId",
          "createdAt",
          "updatedAt",
          "fournisseur",
          "_count",
        ],
      },
      CreateMedicamentInput: {
        type: "object",
        properties: {
          code: { type: "string", minLength: 2, example: "MED-001" },
          libelle: { type: "string", minLength: 2, example: "Paracetamol" },
          prix: { type: "number", minimum: 0.01, example: 1500 },
          qteStock: { type: "integer", minimum: 0, example: 25 },
          dateExpiration: { type: "string", format: "date-time", example: "2099-12-31T00:00:00.000Z" },
          fournisseurId: { type: "string", format: "uuid" },
        },
        required: ["code", "libelle", "prix", "qteStock", "dateExpiration", "fournisseurId"],
      },
      UpdateMedicamentInput: {
        allOf: [
          schemaRef("CreateMedicamentInput"),
          {
            type: "object",
            minProperties: 1,
          },
        ],
      },
      Vente: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          clientId: { type: "string", format: "uuid" },
          medicamentId: { type: "string", format: "uuid" },
          quantite: { type: "integer", example: 2 },
          dateVente: { type: "string", format: "date-time" },
          montantTotal: { type: "number", format: "float", example: 3000 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          client: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              prenom: { type: "string", example: "Pape" },
              nom: { type: "string", example: "Teuw" },
              email: { type: "string", format: "email", example: "pape@pharma221.sn" },
            },
            required: ["id", "prenom", "nom", "email"],
          },
          medicament: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              code: { type: "string", example: "MED-001" },
              libelle: { type: "string", example: "Paracetamol" },
              prix: { type: "number", example: 1500 },
            },
            required: ["id", "code", "libelle", "prix"],
          },
        },
        required: [
          "id",
          "clientId",
          "medicamentId",
          "quantite",
          "dateVente",
          "montantTotal",
          "createdAt",
          "updatedAt",
          "client",
          "medicament",
        ],
      },
      CreateVenteInput: {
        type: "object",
        properties: {
          clientId: { type: "string", format: "uuid" },
          medicamentId: { type: "string", format: "uuid" },
          quantite: { type: "integer", minimum: 1, example: 2 },
          dateVente: { type: "string", format: "date-time", example: "2026-04-03T12:00:00.000Z" },
        },
        required: ["clientId", "medicamentId", "quantite"],
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verifier la disponibilite du service",
        responses: {
          200: successResponse("Etat de sante de l'API.", APP_MESSAGES.HEALTH_OK, schemaRef("HealthData")),
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Connecter un utilisateur administrateur",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("LoginInput"),
            },
          },
        },
        responses: {
          200: successResponse("Connexion reussie.", APP_MESSAGES.LOGIN_OK, schemaRef("AuthResponse")),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Recuperer l'utilisateur courant via JWT",
        security: [{ bearerAuth: [] }],
        responses: {
          200: successResponse("Utilisateur courant.", APP_MESSAGES.LOGIN_OK, schemaRef("CurrentUser")),
          401: errorResponse("Jeton invalide ou absent.", 401, APP_MESSAGES.UNAUTHORIZED),
        },
      },
    },
    "/clients": {
      get: {
        tags: ["Clients"],
        summary: "Lister les clients",
        responses: {
          200: successResponse(
            "Liste des clients.",
            APP_MESSAGES.CLIENTS_FETCHED,
            {
              type: "array",
              items: schemaRef("Client"),
            },
          ),
        },
      },
      post: {
        tags: ["Clients"],
        summary: "Creer un client",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("CreateClientInput"),
            },
          },
        },
        responses: {
          201: successResponse("Client cree.", APP_MESSAGES.CLIENT_CREATED, schemaRef("Client")),
          409: errorResponse("Email deja utilise.", 409, "L'email client existe deja."),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
    },
    "/clients/{id}": {
      get: {
        tags: ["Clients"],
        summary: "Recuperer un client",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: successResponse("Client trouve.", APP_MESSAGES.CLIENT_FETCHED, schemaRef("Client")),
          404: errorResponse("Client introuvable.", 404, "Client introuvable."),
        },
      },
      patch: {
        tags: ["Clients"],
        summary: "Mettre a jour un client",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("UpdateClientInput"),
            },
          },
        },
        responses: {
          200: successResponse("Client mis a jour.", APP_MESSAGES.CLIENT_UPDATED, schemaRef("Client")),
          404: errorResponse("Client introuvable.", 404, "Client introuvable."),
          409: errorResponse("Email deja utilise.", 409, "L'email client existe deja."),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
      delete: {
        tags: ["Clients"],
        summary: "Supprimer un client",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: successResponse("Client supprime.", APP_MESSAGES.CLIENT_DELETED),
          404: errorResponse("Client introuvable.", 404, "Client introuvable."),
          409: errorResponse(
            "Suppression interdite.",
            409,
            "Suppression interdite: ce client est associe a des ventes.",
          ),
        },
      },
    },
    "/fournisseurs": {
      get: {
        tags: ["Fournisseurs"],
        summary: "Lister les fournisseurs",
        responses: {
          200: successResponse(
            "Liste des fournisseurs.",
            APP_MESSAGES.FOURNISSEURS_FETCHED,
            {
              type: "array",
              items: schemaRef("Fournisseur"),
            },
          ),
        },
      },
      post: {
        tags: ["Fournisseurs"],
        summary: "Creer un fournisseur",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("CreateFournisseurInput"),
            },
          },
        },
        responses: {
          201: successResponse(
            "Fournisseur cree.",
            APP_MESSAGES.FOURNISSEUR_CREATED,
            schemaRef("Fournisseur"),
          ),
          409: errorResponse("Code deja utilise.", 409, "Le code fournisseur existe deja."),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
    },
    "/fournisseurs/{id}": {
      get: {
        tags: ["Fournisseurs"],
        summary: "Recuperer un fournisseur",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: successResponse(
            "Fournisseur trouve.",
            APP_MESSAGES.FOURNISSEUR_FETCHED,
            schemaRef("Fournisseur"),
          ),
          404: errorResponse("Fournisseur introuvable.", 404, "Fournisseur introuvable."),
        },
      },
      patch: {
        tags: ["Fournisseurs"],
        summary: "Mettre a jour un fournisseur",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("UpdateFournisseurInput"),
            },
          },
        },
        responses: {
          200: successResponse(
            "Fournisseur mis a jour.",
            APP_MESSAGES.FOURNISSEUR_UPDATED,
            schemaRef("Fournisseur"),
          ),
          404: errorResponse("Fournisseur introuvable.", 404, "Fournisseur introuvable."),
          409: errorResponse("Code deja utilise.", 409, "Le code fournisseur existe deja."),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
      delete: {
        tags: ["Fournisseurs"],
        summary: "Supprimer un fournisseur",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: successResponse("Fournisseur supprime.", APP_MESSAGES.FOURNISSEUR_DELETED),
          404: errorResponse("Fournisseur introuvable.", 404, "Fournisseur introuvable."),
          409: errorResponse(
            "Suppression interdite.",
            409,
            "Suppression interdite: ce fournisseur est associe a des medicaments.",
          ),
        },
      },
    },
    "/medicaments": {
      get: {
        tags: ["Medicaments"],
        summary: "Lister les medicaments",
        responses: {
          200: successResponse(
            "Liste des medicaments.",
            APP_MESSAGES.MEDICAMENTS_FETCHED,
            {
              type: "array",
              items: schemaRef("Medicament"),
            },
          ),
        },
      },
      post: {
        tags: ["Medicaments"],
        summary: "Creer un medicament",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("CreateMedicamentInput"),
            },
          },
        },
        responses: {
          201: successResponse(
            "Medicament cree.",
            APP_MESSAGES.MEDICAMENT_CREATED,
            schemaRef("Medicament"),
          ),
          404: errorResponse("Fournisseur introuvable.", 404, "Fournisseur introuvable."),
          409: errorResponse("Code deja utilise.", 409, "Le code medicament existe deja."),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
    },
    "/medicaments/{id}": {
      get: {
        tags: ["Medicaments"],
        summary: "Recuperer un medicament",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: successResponse(
            "Medicament trouve.",
            APP_MESSAGES.MEDICAMENT_FETCHED,
            schemaRef("Medicament"),
          ),
          404: errorResponse("Medicament introuvable.", 404, "Medicament introuvable."),
        },
      },
      patch: {
        tags: ["Medicaments"],
        summary: "Mettre a jour un medicament",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("UpdateMedicamentInput"),
            },
          },
        },
        responses: {
          200: successResponse(
            "Medicament mis a jour.",
            APP_MESSAGES.MEDICAMENT_UPDATED,
            schemaRef("Medicament"),
          ),
          404: errorResponse("Medicament ou fournisseur introuvable.", 404, "Medicament introuvable."),
          409: errorResponse("Conflit metier.", 409, "Le code medicament existe deja."),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
      delete: {
        tags: ["Medicaments"],
        summary: "Supprimer un medicament",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: successResponse("Medicament supprime.", APP_MESSAGES.MEDICAMENT_DELETED),
          404: errorResponse("Medicament introuvable.", 404, "Medicament introuvable."),
          409: errorResponse(
            "Suppression interdite.",
            409,
            "Suppression interdite: ce medicament est associe a des ventes.",
          ),
        },
      },
    },
    "/ventes": {
      get: {
        tags: ["Ventes"],
        summary: "Lister les ventes",
        responses: {
          200: successResponse(
            "Liste des ventes.",
            APP_MESSAGES.VENTES_FETCHED,
            {
              type: "array",
              items: schemaRef("Vente"),
            },
          ),
        },
      },
      post: {
        tags: ["Ventes"],
        summary: "Enregistrer une vente",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("CreateVenteInput"),
            },
          },
        },
        responses: {
          201: successResponse("Vente creee.", APP_MESSAGES.VENTE_CREATED, schemaRef("Vente")),
          404: errorResponse("Client ou medicament introuvable.", 404, "Client introuvable."),
          409: errorResponse("Conflit metier.", 409, "Stock insuffisant pour effectuer la vente."),
          422: errorResponse("Donnees invalides.", 422, APP_MESSAGES.VALIDATION_FAILED),
        },
      },
    },
    "/ventes/{id}": {
      get: {
        tags: ["Ventes"],
        summary: "Recuperer une vente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: successResponse("Vente trouvee.", APP_MESSAGES.VENTE_FETCHED, schemaRef("Vente")),
          404: errorResponse("Vente introuvable.", 404, "Vente introuvable."),
        },
      },
    },
  },
} as const;
