/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifier que l'API est disponible
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API disponible
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lister les espaces utilisateurs existants
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Se connecter ou creer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Utilisateur retourne avec son arbre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Supprimer un utilisateur et tout son arbre genealogique
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur et arbre supprimes
 */

/**
 * @swagger
 * /api/trees/{userId}:
 *   get:
 *     summary: Recuperer l'arbre complet d'un utilisateur
 *     tags: [Trees]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arbre retourne
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tree'
 *   put:
 *     summary: Remplacer l'arbre complet d'un utilisateur
 *     tags: [Trees]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReplaceTreeRequest'
 *     responses:
 *       200:
 *         description: Arbre sauvegarde
 */

/**
 * @swagger
 * /api/trees/{userId}/families/{familyId}/partner:
 *   post:
 *     summary: Ajouter un partenaire a une famille
 *     tags: [Trees]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: familyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NamePayload'
 *     responses:
 *       200:
 *         description: Arbre mis a jour
 *   delete:
 *     summary: Supprimer le partenaire et ses branches descendantes
 *     tags: [Trees]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: familyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arbre mis a jour
 */

/**
 * @swagger
 * /api/trees/{userId}/families/{familyId}/children:
 *   post:
 *     summary: Ajouter un enfant a une famille
 *     tags: [Trees]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: familyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NamePayload'
 *     responses:
 *       200:
 *         description: Arbre mis a jour
 */

/**
 * @swagger
 * /api/trees/{userId}/people/{personId}:
 *   patch:
 *     summary: Renommer une personne
 *     tags: [Trees]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: personId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NamePayload'
 *     responses:
 *       200:
 *         description: Arbre mis a jour
 */

/**
 * @swagger
 * /api/trees/{userId}/families/{familyId}:
 *   delete:
 *     summary: Supprimer une branche complete de l'arbre
 *     tags: [Trees]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: familyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arbre mis a jour
 */
