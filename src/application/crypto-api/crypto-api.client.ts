import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CRYPTOCOMPARE_API_URL = process.env.CRYPTOCOMPARE_API_URL!;

export const getCryptoPrice = async (fsym: string, tsyms: string): Promise<any> => {
    const response = await axios.get(CRYPTOCOMPARE_API_URL, {
      params: {
        fsym,
        tsyms
      }
    });

    return response.data;
};

