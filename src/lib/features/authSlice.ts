// import { initializeWeb3Auth, resetWeb3AuthInitialization } from "@/utils/web3auth";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// interface AuthState {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: AuthState = {
//   isAuthenticated: typeof window !== "undefined" ? !!sessionStorage.getItem("jwtToken") : false,
//   isLoading: false,
//   error: null,
// };

// export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
//   try {
//     const jwtToken = typeof window !== "undefined" ? sessionStorage.getItem("jwtToken") : null;
//     if (!jwtToken) {
//       throw new Error("No JWT token found");
//     }

//     const web3auth = await initializeWeb3Auth(); 
//     if (web3auth) {
//       await web3auth.logout();
//       await web3auth.clearCache();
//       resetWeb3AuthInitialization();
//     }

//     const response = await fetch("https://api.coin-crush.com/v1/auth/logout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${jwtToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to logout");
//     }

//     if (typeof window !== "undefined") {
//       localStorage.clear()
//     }

//     return null;
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Logout failed");
//   }
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     resetAuth: (state) => {
//       state.isAuthenticated = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(logoutUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.isLoading = false;
//         state.isAuthenticated = false;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { resetAuth } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletInfo {
  address: string;
  chainName: string;
  walletType: 'embedded' | 'external';
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    wallets?: WalletInfo[];
    [key: string]: any;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<any>) => {
      const embeddedWallets = action.payload?.linkedAccounts
        ?.filter((account: any) => 
          account.chain === 'solana' && 
          account.walletClientType === 'privy'
        )
        .map((account: any) => ({
          address: account.address,
          chainName: account.chain,
          walletType: 'embedded'
        })) || [];
      
      const externalWallets = action.payload?.linkedAccounts
        ?.filter((account: any) => 
          account.chain === 'solana' && 
          account.walletClientType !== 'privy'
        )
        .map((account: any) => ({
          address: account.address,
          chainName: account.chain,
          walletType: 'external'
        })) || [];
      
      // Combine both wallet types
      const allWallets = [...embeddedWallets, ...externalWallets];
      
      state.isAuthenticated = true;
      state.user = {
        ...action.payload,
        wallets: allWallets
      };
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateWallets: (state, action: PayloadAction<WalletInfo[]>) => {
      if (state.user) {
        state.user.wallets = action.payload;
      }
    },
  },
});

export const { loginSuccess, logoutSuccess, updateWallets } = authSlice.actions;
export default authSlice.reducer;