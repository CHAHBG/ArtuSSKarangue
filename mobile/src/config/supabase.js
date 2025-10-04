import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Supabase
const SUPABASE_URL = 'https://xsnrzyzgphmjivdqpgst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzbnp5emdwaG1qaXZkcXBnc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNzk4MDYxOCwiZXhwIjoyMDQzNTU2NjE4fQ.bSKFicod5wSIDa7C6B-G8JOp-j0vXkNiIJqGR13rVnE';

// Créer le client Supabase avec AsyncStorage pour React Native
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions pour l'authentification
export const supabaseAuth = {
  // Inscription
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom: userData.nom,
          prenom: userData.prenom,
          telephone: userData.telephone,
          role: userData.role || 'citizen',
          username: userData.username,
          full_name: userData.full_name,
        },
      },
    });

    if (error) throw error;

    // Insérer les données supplémentaires dans la table utilisateurs
    if (data.user) {
      const { error: insertError } = await supabase
        .from('utilisateurs')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            nom: userData.nom,
            prenom: userData.prenom,
            telephone: userData.telephone,
            phone_number: userData.telephone,
            role: userData.role || 'citizen',
            username: userData.username,
            full_name: userData.full_name,
            is_active: true,
            is_verified: false,
          },
        ]);

      if (insertError) {
        console.error('Error inserting user data:', insertError);
      }
    }

    return data;
  },

  // Connexion
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Récupérer la session actuelle
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Récupérer le profil complet depuis la table utilisateurs
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('utilisateurs')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour le profil
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('utilisateurs')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour la localisation
  updateLocation: async (userId, latitude, longitude) => {
    const { data, error } = await supabase
      .from('utilisateurs')
      .update({ latitude, longitude })
      .eq('id', userId);

    if (error) throw error;
    return data;
  },
};

// Helper functions pour les urgences
export const supabaseEmergencies = {
  // Créer une urgence
  create: async (emergencyData, userId) => {
    const { data, error } = await supabase
      .from('emergencies')
      .insert([
        {
          ...emergencyData,
          user_id: userId,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les urgences actives
  getActive: async () => {
    const { data, error } = await supabase
      .from('emergencies')
      .select(`
        *,
        utilisateurs:user_id (
          nom,
          prenom,
          telephone,
          profile_picture
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer les urgences d'un utilisateur
  getUserEmergencies: async (userId) => {
    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mettre à jour le statut d'une urgence
  updateStatus: async (emergencyId, status) => {
    const { data, error } = await supabase
      .from('emergencies')
      .update({ status })
      .eq('id', emergencyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // S'abonner aux changements en temps réel
  subscribeToChanges: (callback) => {
    const subscription = supabase
      .channel('emergencies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergencies',
        },
        callback
      )
      .subscribe();

    return subscription;
  },
};

export default supabase;
