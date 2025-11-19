import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatbotUI from './ChatbotUI';
import * as blocklist from './blocklist';

describe('ChatbotUI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the welcome message', () => {
      render(<ChatbotUI />);
      expect(screen.getByText(/Ask me about SFWE classes/i)).toBeInTheDocument();
    });

    it('should render the chat input', () => {
      render(<ChatbotUI />);
      expect(screen.getByPlaceholderText(/Send a message/i)).toBeInTheDocument();
    });

    it('should render the send button', () => {
      render(<ChatbotUI />);
      expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
    });

    it('should render suggestion chips', () => {
      render(<ChatbotUI />);
      expect(screen.getByText('What scholarships are open now?')).toBeInTheDocument();
      expect(screen.getByText('Show SE clubs.')).toBeInTheDocument();
    });

    it('should render new chat button', () => {
      render(<ChatbotUI />);
      expect(screen.getByRole('button', { name: /New Chat/i })).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle dark mode', () => {
      render(<ChatbotUI />);
      const themeButton = screen.getByLabelText(/Toggle theme/i);
      
      // Initially dark mode
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      // Toggle to light mode
      fireEvent.click(themeButton);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      
      // Toggle back to dark mode
      fireEvent.click(themeButton);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Message Input', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      await user.type(input, 'Hello');
      
      expect(input).toHaveValue('Hello');
    });

    it('should disable send button when input is empty', () => {
      render(<ChatbotUI />);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      expect(sendButton).toBeDisabled();
    });

    it('should enable send button when input has text', async () => {
      const user = userEvent.setup();
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'Hello');
      expect(sendButton).not.toBeDisabled();
    });
  });

  describe('Blocklist Integration', () => {
    it('should block messages with inappropriate words', async () => {
      const user = userEvent.setup();
      const containsSpy = vi.spyOn(blocklist, 'containsBlockedWords').mockReturnValue(true);
      const messageSpy = vi.spyOn(blocklist, 'getBlockedMessage').mockReturnValue('Blocked message');
      
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'bad word');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Blocked message')).toBeInTheDocument();
      });
      
      containsSpy.mockRestore();
      messageSpy.mockRestore();
    });

    it('should not call API when message is blocked', async () => {
      const user = userEvent.setup();
      const fetchMock = vi.fn();
      global.fetch = fetchMock;
      
      const containsSpy = vi.spyOn(blocklist, 'containsBlockedWords').mockReturnValue(true);
      
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'bad word');
      fireEvent.click(sendButton);
      
      expect(fetchMock).not.toHaveBeenCalled();
      containsSpy.mockRestore();
    });
  });

  describe('Sending Messages', () => {
    it('should send message on button click', async () => {
      const user = userEvent.setup();
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ response: 'Bot response', sessionId: '123' }),
      });
      global.fetch = fetchMock;
      
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'Hello bot');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          'http://localhost:5000/api/chat',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });
    });

    it('should display user message immediately', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ response: 'Bot response', sessionId: '123' }),
      });
      
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'Test message');
      fireEvent.click(sendButton);
      
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should clear input after sending', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ response: 'Bot response', sessionId: '123' }),
      });
      
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i) as HTMLTextAreaElement;
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'Test');
      fireEvent.click(sendButton);
      
      expect(input.value).toBe('');
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });
      
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'Test');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Unfortunately, an error occured/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      render(<ChatbotUI />);
      
      const input = screen.getByPlaceholderText(/Send a message/i);
      const sendButton = screen.getByRole('button', { name: /Send/i });
      
      await user.type(input, 'Test');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Request failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Suggestion Chips', () => {
    it('should send message when chip is clicked', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ response: 'Bot response', sessionId: '123' }),
      });
      global.fetch = fetchMock;
      
      render(<ChatbotUI />);
      
      const chips = screen.getAllByRole('button', { name: /Show SE clubs/i });
      const chip = chips[chips.length - 1]; // Get the chip button, not the message
      fireEvent.click(chip);
      
      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });
    });
  });

  describe('New Chat', () => {
    it('should create a new conversation', () => {
      render(<ChatbotUI />);
      
      const newChatButton = screen.getByRole('button', { name: /New Chat/i });
      fireEvent.click(newChatButton);
      
      expect(screen.getByText('New conversation started. How can I help?')).toBeInTheDocument();
    });

    it('should switch to new conversation', () => {
      render(<ChatbotUI />);
      
      const newChatButton = screen.getByRole('button', { name: /New Chat/i });
      fireEvent.click(newChatButton);
      
      // Should show new chat message, not welcome message
      expect(screen.queryByText(/Hey there 👋 I'm your CatGPT bot/i)).not.toBeInTheDocument();
      expect(screen.getByText('New conversation started. How can I help?')).toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('should copy last message to clipboard', () => {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
      
      render(<ChatbotUI />);
      
      const copyButton = screen.getByRole('button', { name: /Copy last/i });
      fireEvent.click(copyButton);
      
      // Verify clipboard.writeText was called
      expect(writeTextSpy).toHaveBeenCalled();
      writeTextSpy.mockRestore();
    });
  });
});
