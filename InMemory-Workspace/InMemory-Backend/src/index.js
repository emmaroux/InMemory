'use strict';

const { seedDatabase } = require('../scripts/seed');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('\n\n\n');
    console.log('#############################################');
    console.log('### DÉBUT DU BOOTSTRAP DE STRAPI ###');
    console.log('#############################################');
    console.log('\n');
    
    try {
      console.log('=== Vérification de l\'instance Strapi ===');
      console.log('Strapi est-il défini ?', !!strapi);
      console.log('Type de Strapi:', typeof strapi);
      
      console.log('\n=== Démarrage du processus de seeding ===');
      await seedDatabase({ strapi });
      console.log('\n=== Seeding terminé avec succès ===');
    } catch (error) {
      console.error('\n');
      console.error('#############################################');
      console.error('### ERREUR CRITIQUE LORS DU SEEDING ###');
      console.error('#############################################');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('#############################################');
      console.error('\n\n\n');
      throw error;
    }
    
    console.log('\n');
    console.log('#############################################');
    console.log('### FIN DU BOOTSTRAP DE STRAPI ###');
    console.log('#############################################');
    console.log('\n\n\n');
  },
};
