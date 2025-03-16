import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const PREPARE_TRANSACTION_URL = "https://api.coin-crush.com/v1/solana/prepareTransaction";
const SEND_SIGNED_TRANSACTION_URL = "https://api.coin-crush.com/v1/solana/sendSignedTransaction";
const CONFIRM_TRANSACTION_URL = "https://api.coin-crush.com/v1/solana/confirmTransaction";

interface TransactionState {
  preparedData: any;
  txResult: {
    txid: string | null;
    status: string | null;
    stakedConnection: boolean | null;
  };
  isPrepareLoading: boolean;
  isSending: boolean;
  isConfirming: boolean;
  error?: string;
}

const initialState: TransactionState = {
  preparedData: null,
  txResult: {
    txid: null,
    status: null,
    stakedConnection: null
  },
  isPrepareLoading: false,
  isSending: false,
  isConfirming: false,
  error: undefined,
};

export const prepareTransaction = createAsyncThunk(
  "transaction/prepareTransaction",
  async (
    { senderPublicKey, recipientPublicKey, amountInLamports, jwtToken }: { senderPublicKey: string; recipientPublicKey: string; amountInLamports: number; jwtToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(PREPARE_TRANSACTION_URL, {
        senderPublicKey,
        recipientPublicKey,
        amountInLamports,
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendSignedTransaction = createAsyncThunk(
  "transaction/sendSigned",
  async ({ signedTx, jwtToken }: { signedTx: string; jwtToken: string }, { rejectWithValue }) => {
    try {
      // Validate base64 format
      if (!/^[A-Za-z0-9+/=]+$/.test(signedTx)) {
        throw new Error("Invalid base64 transaction format");
      }

      const response = await axios.post(
        SEND_SIGNED_TRANSACTION_URL,
        {
          signedTransaction: signedTx,
          network: "devnet",
          commitment: "confirmed"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`
          },
          timeout: 15000
        }
      );

      if (!response?.data?.response?.success) {
        throw new Error(response?.data?.response?.error || "Transaction submission failed");
      }

      return {
        txid: response?.data?.response?.txid,
        status: response?.data?.response?.status,
        stakedConnection: response?.data?.response?.stakedConnection
      };

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 
        error.message || 
        "Network error during transaction submission"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(prepareTransaction.pending, (state) => {
        state.isPrepareLoading = true;
        state.error = undefined;
      })
      .addCase(prepareTransaction.fulfilled, (state, action) => {
        state.isPrepareLoading = false;
        state.preparedData = action.payload;
      })
      .addCase(prepareTransaction.rejected, (state, action) => {
        state.isPrepareLoading = false;
        state.error = action.payload as string;
      })
      // Send Transaction
    builder
    .addCase(sendSignedTransaction.pending, (state) => {
      state.isSending = true;
      state.error = undefined;
    })
    .addCase(sendSignedTransaction.fulfilled, (state, action) => {
      state.isSending = false;
      state.txResult = {
        txid: action.payload.txid,
        status: action.payload.status,
        stakedConnection: action.payload.stakedConnection
      };
    })
    .addCase(sendSignedTransaction.rejected, (state, action) => {
      state.isSending = false;
      state.error = action.payload as string;
    });
  },
});

export default transactionSlice.reducer;
