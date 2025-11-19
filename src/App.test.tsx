import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render ChatbotUI component', () => {
    render(<App />);
    // Check if the main chatbot UI is rendered
    expect(screen.getByRole('button', { name: /New Chat/i })).toBeInTheDocument();
  });

  it('should render the welcome message', () => {
    render(<App />);
    expect(screen.getByText(/Ask me about SFWE classes/i)).toBeInTheDocument();
  });
});
