export default {
  namespace: 'app',
  state: {
    accountName: '',
    accountAddr: '',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};