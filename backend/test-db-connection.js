/**
 * Script de test de connexion Supabase
 * À exécuter localement pour vérifier la connexion
 */

const { Pool } = require('pg');

// Connexion Supabase
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:Sensei00@db.xsnrzyzgphmjivdqpgst.supabase.co:5432/postgres';

console.log('🔍 Test de connexion Supabase...');
console.log(`📡 URL (masquée): ${DATABASE_URL.replace(/:([^@]+)@/, ':****@')}`);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('\n⏳ Connexion en cours...');
    const client = await pool.connect();
    console.log('✅ Connexion réussie !');
    
    // Test 1: Version PostgreSQL
    console.log('\n📊 Test 1: Version PostgreSQL');
    const versionResult = await client.query('SELECT version()');
    console.log(`   ${versionResult.rows[0].version}`);
    
    // Test 2: Heure du serveur
    console.log('\n🕐 Test 2: Heure serveur');
    const timeResult = await client.query('SELECT NOW() as time');
    console.log(`   ${timeResult.rows[0].time}`);
    
    // Test 3: Liste des tables
    console.log('\n📋 Test 3: Tables existantes');
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  Aucune table trouvée !');
    } else {
      console.log(`   Trouvées: ${tablesResult.rows.length} tables`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.tablename}`);
      });
    }
    
    // Test 4: Table utilisateurs
    console.log('\n👥 Test 4: Structure table utilisateurs');
    try {
      const columnsResult = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'utilisateurs'
        ORDER BY ordinal_position
      `);
      
      if (columnsResult.rows.length === 0) {
        console.log('   ❌ Table "utilisateurs" n\'existe pas !');
      } else {
        console.log(`   ✅ ${columnsResult.rows.length} colonnes`);
        columnsResult.rows.forEach(row => {
          console.log(`   - ${row.column_name}: ${row.data_type}`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
    
    client.release();
    console.log('\n✅ Tous les tests terminés avec succès !');
    
  } catch (error) {
    console.error('\n❌ ERREUR DE CONNEXION:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    if (error.code === 'ENOTFOUND') {
      console.error('   → Le serveur Supabase n\'est pas accessible');
      console.error('   → Vérifiez votre connexion Internet');
    } else if (error.code === '28P01') {
      console.error('   → Mot de passe incorrect');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   → Connexion refusée (firewall ou port bloqué)');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
