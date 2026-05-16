import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../redux/slices/authSlice';
import workspaceReducer from '../redux/slices/workspaceSlice';
import boardReducer from '../redux/slices/boardSlice';
import notificationReducer from '../redux/slices/notificationSlice';

export function renderWithProviders(ui, { preloadedState = {}, initialEntries = ['/'] } = {}) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      workspace: workspaceReducer,
      board: boardReducer,
      notification: notificationReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>
    </Provider>
  );
}
