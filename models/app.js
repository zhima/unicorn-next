export default {
  namespace: 'app',
  state: {
    accountAddr: '',
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};