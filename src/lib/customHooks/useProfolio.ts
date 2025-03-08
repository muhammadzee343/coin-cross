import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { refreshPortfolio } from "../features/portfolioSlice";

export const useRefreshPortfolio = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector(
    (state: RootState) => state.portfolio
  );

  const fetchPortfolio = (publicKey: string, token: string) => {
    return dispatch(refreshPortfolio({ publicKey, token })).unwrap();
  };

  return { loading, data, error, fetchPortfolio };
};
