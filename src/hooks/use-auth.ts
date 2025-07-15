"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getUserById } from "@/lib/actions/user/user-get";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as AppUser } from "@/types/user";

interface AuthState {
  supabaseUser: SupabaseUser | null;
  profile: AppUser | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    supabaseUser: null,
    profile: null,
    loading: true,
  });
  
  const supabase = createClient();

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserById(userId);
      return profile;
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      return null;
    }
  };

  useEffect(() => {
    // 초기 세션 가져오기
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUser = session?.user ?? null;
      
      let profile = null;
      if (supabaseUser) {
        profile = await loadUserProfile(supabaseUser.id);
      }
      
      setAuthState({
        supabaseUser,
        profile,
        loading: false,
      });
    };

    getInitialSession();

    // 인증 상태 변화 리스닝
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const supabaseUser = session?.user ?? null;
        
        let profile = null;
        if (supabaseUser) {
          profile = await loadUserProfile(supabaseUser.id);
        }
        
        setAuthState({
          supabaseUser,
          profile,
          loading: false,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user: authState.supabaseUser, // 호환성을 위해 유지
    profile: authState.profile,
    loading: authState.loading,
    signOut,
    isAuthenticated: !!authState.supabaseUser,
  };
}