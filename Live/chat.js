// Function to initialize chat - works for both DOMContentLoaded and dynamic loading
function initializeChatSystem() {
  console.log('Chat.js: Initializing chat system');
  
  // Get batch parameter from URL for batch-specific username storage
  const urlParams = new URLSearchParams(window.location.search);
  const currentBatch = urlParams.get('batch') || 'default';
  console.log('Chat.js: Current batch =', currentBatch);
  
  // Reuse global Supabase client (initialised in supabaseClient.js)
  const supabase = window.supabaseClient;

  // Check if Supabase client is available
  if (!supabase) {
    console.error('Supabase client not available in chat.js');
    return;
  }

  console.log('Chat.js: Supabase client is available');

  // Security constants
  const BLOCKED_URL_PATTERNS = [
    /https?:\/\/[^\s]+/gi,
    /www\.[^\s]+/gi,
    /[^\s]+\.[a-z]{2,}/gi
  ];
  let BLOCKED_WORDS = [];

  // Fetch blocked words from Supabase
  (async () => {
    try {
      console.log('Chat.js: Fetching blocked words from Supabase');
      const { data, error } = await supabase
        .from('blocked_words')
        .select('word');
    
      if (!error && data) {
        BLOCKED_WORDS = data.map(item => item.word);
        console.log('Chat.js: Blocked words loaded from Supabase');
      } else {
        console.warn('Chat.js: Failed to fetch blocked words, using fallback');
        // Fallback to default words if fetch fails
        BLOCKED_WORDS = [
          'ass', 'fuck', 'fuckk', 'motherfuck', 'bhenchod', 'madarchod', 'bsdk', 'bhosdike',
          'chutiya', 'subscribe', 'harami', 'bhadwa', 'fuckkk', 'XXX', 'XXXX', 'porn', 'sex', 'sexx',
          'f@ck', 'sexxx', 'gand', 'land', 'loda', 'gandu', 'lodu', 'lamd', 'pornn'
        ];
      }
    } catch (err) {
      console.error('Chat.js: Error fetching blocked words:', err);
      // Fallback to default words if fetch fails
      BLOCKED_WORDS = [
        'ass', 'fuck', 'fuckk', 'motherfuck', 'bhenchod', 'madarchod', 'bsdk', 'bhosdike',
        'chutiya', 'subscribe', 'harami', 'bhadwa', 'fuckkk', 'XXX', 'XXXX', 'porn', 'sex', 'sexx',
        'f@ck', 'sexxx', 'gand', 'land', 'loda', 'gandu', 'lodu', 'lamd', 'pornn'
      ];
    }
  })();

  const MAX_WARNINGS = 1;
  const INITIAL_TIMEOUT = 5 * 60 * 1000;
  const ESCALATED_TIMEOUT = 10 * 60 * 1000;
  const EXTENDED_TIMEOUT = 30 * 60 * 1000; 
  const DUPLICATE_THRESHOLD = 2;
  const CLEAN_MESSAGES_TO_RESET = 2;
  const MESSAGE_LIFETIME = 30 * 60 * 1000;
  const NAME_CHANGE_COOLDOWN = 2 * 60 * 60 * 1000;
  const BANNED_MESSAGE = "🚫 You have been banned by Admin";

  let currentUser = null;
  let typingTimeout = null;
  const TYPING_TIMEOUT_LENGTH = 3000;
  let chatDisabledMessageShown = false;

  // User warning and timeout tracking
  let userWarnings = JSON.parse(localStorage.getItem('userWarnings')) || {};
  let userCleanMessages = JSON.parse(localStorage.getItem('userCleanMessages')) || {};
  let userTimeoutLevel = JSON.parse(localStorage.getItem('userTimeoutLevel')) || {};
  let userTimeoutEnd = JSON.parse(localStorage.getItem('userTimeoutEnd')) || {};
  let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || {};

  // Track each user's last message to detect duplicates/spam
  let lastMessages = JSON.parse(localStorage.getItem('lastMessages')) || {};

  // Available colors pool (80 vibrant colors)
  const availableColors = [
    // Reds & Pinks
    '#ff0000', '#ff4444', '#ff6666', '#ff8888', '#ffaaaa', '#e74c3c', '#c0392b', '#dc143c',
    '#ff1493', '#ff69b4', '#ff6347', '#ff4500', '#ff0080', '#e91e63', '#f06292', '#ec407a',
    
    // Oranges & Yellows
    '#ff6200', '#ff7744', '#ff9800', '#ff5722', '#ffaa00', '#ffcc00', '#ffc107', '#f39c12',
    '#f1c40f', '#ffeb3b', '#cddc39', '#d35400', '#e67e22', '#ff8c00', '#ffa500', '#ffb347',
    
    // Greens
    '#00ff88', '#44ff44', '#aaff44', '#2ecc71', '#27ae60', '#4caf50', '#8bc34a', '#009688',
    '#16a085', '#1abc9c', '#00ff00', '#32cd32', '#90ee90', '#98fb98', '#00fa9a', '#00ff7f',
    
    // Blues & Cyans
    '#00c4ff', '#00ddff', '#44aaff', '#3498db', '#2980b9', '#2196f3', '#03a9f4', '#00bcd4',
    '#0099cc', '#0077be', '#4169e1', '#1e90ff', '#87ceeb', '#87cefa', '#00ffff', '#40e0d0',
    
    // Purples & Violets
    '#aa00ff', '#ff00aa', '#cc00cc', '#9b59b6', '#8e44ad', '#673ab7', '#3f51b5', '#9c27b0',
    '#8a2be2', '#9370db', '#ba55d3', '#da70d6', '#dda0dd', '#ee82ee', '#ff00ff', '#c71585',
    
    // Teals & Aquas
    '#00cccc', '#20b2aa', '#48d1cc', '#00ced1', '#5f9ea0', '#4682b4', '#6495ed', '#7b68ee',
    '#008b8b', '#2f4f4f', '#008080', '#40826d', '#66cdaa', '#7fffd4', '#afeeee', '#b0e0e6',
    
    // Browns & Earth Tones
    '#795548', '#8d6e63', '#a1887f', '#bcaaa4', '#d7ccc8', '#deb887', '#f4a460', '#cd853f',
    '#d2691e', '#bc8f8f', '#f5deb3', '#daa520', '#b8860b', '#8b4513', '#a0522d', '#sienna',
    
    // Grays & Unique Colors
    '#34495e', '#95a5a6', '#7f8c8d', '#607d8b', '#546e7a', '#78909c', '#90a4ae', '#b0bec5'
  ];

  // Check for stored username (batch-specific)
  const userStorageKey = `currentUser_${currentBatch}`;
  const storedUser = localStorage.getItem(userStorageKey);
  console.log('Chat.js: Checking for stored user with key:', userStorageKey);
  
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    console.log('Chat.js: Found stored user for batch:', currentBatch, currentUser.username);
    initChat();
  } else {
    console.log('Chat.js: No stored user for batch:', currentBatch, '- showing username modal');
    document.getElementById('username-modal').style.display = 'block';
    document.getElementById('username-submit').addEventListener('click', setUsername);
    document.getElementById('username-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') setUsername();
    });
  }

  // Functions
  async function setUsername() {
    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value.trim();

    // Hardcoded restricted words for usernames only
    const RESTRICTED_USERNAME_WORDS = [
      'admin', 'mod', 'owner', 'moderator', 'administrator'
    ];

    // Function to check for restricted word variations
    function containsRestrictedWord(username) {
      // Remove all spaces and special characters for comparison
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      return RESTRICTED_USERNAME_WORDS.some(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Only block if restricted word appears as standalone or with obvious modifications
        // This prevents blocking legitimate names like "pramod", "ahmad", etc.
        
        // Pattern 1: Exact match (e.g., "mod")
        if (cleanUsername === cleanWord) return true;
        
        // Pattern 2: Word + numbers (e.g., "mod123", "admin456")
        if (cleanUsername.startsWith(cleanWord) && /^[0-9]+$/.test(cleanUsername.slice(cleanWord.length))) {
          return true;
        }
        
        // Pattern 3: Numbers + word (e.g., "123mod", "456admin")
        if (cleanUsername.endsWith(cleanWord) && /^[0-9]+$/.test(cleanUsername.slice(0, -cleanWord.length))) {
          return true;
        }
        
        // Pattern 4: Word + short suffix (e.g., "modx", "admin1", "mod_")
        if (cleanUsername.startsWith(cleanWord) && cleanUsername.length <= cleanWord.length + 2) {
          return true;
        }
        
        // Pattern 5: Short prefix + word (e.g., "xmod", "1admin")
        if (cleanUsername.endsWith(cleanWord) && cleanUsername.length <= cleanWord.length + 2) {
          return true;
        }
        
        return false;
      });
    }

    if (username.length < 3) {
      showModernWarning('⚠️ Invalid Username', 'Username must be at least 3 characters', '#FF4444');
      return;
    }

    if (username.length > 20) {
      showModernWarning('⚠️ Invalid Username', 'Username must be less than 20 characters', '#FF4444');
      return;
    }
    
    // Generate user ID first
    const userId = generateId();
    
    // Check if user is blocked
    if (blockedUsers[userId]) {
      showModernWarning('🚫 Access Denied', 'You have been blocked from this chat', '#FF4444');
      return;
    }

    // Check for restricted words (only if not admin)
    const { data: adminCheck, error: adminError } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (!adminCheck && containsRestrictedWord(username)) {
      showModernWarning('🚫 Restricted Username', 'This username resembles a staff title', '#FF0000');
      return;
    }

    // Then check for blocked words
    const containsBlockedWord = BLOCKED_WORDS.some(word => 
      username.toLowerCase().includes(word.toLowerCase())
    );
    
    if (containsBlockedWord) {
      showModernWarning('⚠️ Invalid Username', 'Username contains inappropriate content', '#FF4444');
      return;
    }

    currentUser = {
      id: userId,
      name: username,
      color: await getUniqueColor(),
      lastNameChange: null
    };

    localStorage.setItem(userStorageKey, JSON.stringify(currentUser));

    // Add user to online table
    await supabase
      .from('online')
      .upsert({
        id: currentUser.id,
        username: currentUser.name,
        color: currentUser.color,
        last_active: new Date().toISOString()
      });

    document.getElementById('username-modal').style.display = 'none';
    initChat();
  }

  async function getUniqueColor() {
    try {
      const { data: onlineUsers } = await supabase
        .from('online')
        .select('color')
        .limit(50);
      const usedColors = onlineUsers.map(user => user.color);
      const shuffledColors = [...availableColors].sort(() => 0.5 - Math.random());
      const availableColor = shuffledColors.find(color => !usedColors.includes(color));
      return availableColor || shuffledColors[0];
    } catch (error) {
      console.error('Error fetching unique color:', error);
      return availableColors[Math.floor(Math.random() * availableColors.length)];
    }
  }

  async function initChat() {
    console.log('InitChat: Starting chat initialization');
    
    // Check if Supabase client is available
    if (!supabase) {
      console.error('InitChat: Supabase client not available');
      return;
    }
    
    const messagesContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const usernameIcon = document.getElementById('change-username-icon');
    const pinnedMessageContainer = document.getElementById('pinned-message-container');

    // Set username icon color to match user's color
    if (usernameIcon && currentUser && currentUser.color) {
      usernameIcon.style.color = currentUser.color;
    }

    // Check ban status on load
    let banned = null;
    try {
      console.log('InitChat: Checking ban status for user:', currentUser.id);
      const { data: banData } = await supabase
          .from('banned_users')
          .select('id, reason')
          .eq('id', currentUser.id)
          .single();
      
      banned = banData;
      if (banned) {
          console.log('InitChat: User is banned:', banned.reason);
          applyBanToInput(banned.reason);
      }
    } catch (error) {
      console.error('InitChat: Error checking ban status:', error);
      // Continue with chat initialization even if ban check fails
    }

    // Check for existing timeout
    if (userTimeoutEnd[currentUser.id] && userTimeoutEnd[currentUser.id] > Date.now()) {
        applyTimeoutToInput(userTimeoutEnd[currentUser.id] - Date.now());
    }

    // Function to update chat UI based on status
    async function updateChatUI(chatEnabled, isAdmin) {
        // Clear current messages
        messagesContainer.innerHTML = '';
        chatDisabledMessageShown = false;

        // Disable chat input area if chat is disabled or user is banned/timed out
        if (!chatEnabled) {
            messageInput.disabled = true;
            sendButton.disabled = true;
            messageInput.setAttribute('disabled', 'disabled');
            sendButton.setAttribute('disabled', 'disabled');
            messageInput.placeholder = 'Chat disabled by Admin';

            if (!chatDisabledMessageShown) {
                const msg = document.createElement('div');
                msg.id = 'chat-disabled-message';
                msg.className = 'system-message';
                msg.textContent = '🚫 Chat has been disabled by admin';
                messagesContainer.appendChild(msg);
                chatDisabledMessageShown = true;
            }
            return; // Don't load any messages if chat is disabled
        } else {
            // Chat is enabled – only keep it disabled if the user is banned or still timed-out
            const isStillTimedOut = userTimeoutEnd[currentUser.id] && userTimeoutEnd[currentUser.id] > Date.now();
            if (!banned && !isStillTimedOut) {
                messageInput.disabled = false;
                sendButton.disabled = false;
                messageInput.removeAttribute('disabled');
                sendButton.removeAttribute('disabled');
                messageInput.placeholder = 'Chat Now...';
            }
        }

        // Fetch and display recent messages
        const cutoff = new Date(Date.now() - MESSAGE_LIFETIME).toISOString();
        const { data: recentMessages } = await supabase
            .from('messages')
            .select('id, user_id, username, text, color, timestamp')
            .gt('timestamp', cutoff)
            .order('timestamp', { ascending: true })
            .limit(200);
        recentMessages.forEach(message => {
            if (chatEnabled || isAdmin) {
                displayMessage(message, message.id, isAdmin, chatEnabled);
            }
        });

        // Ensure messages are sorted by timestamp after initial load
        sortMessagesByTimestamp();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        function sortMessagesByTimestamp() {
            const msgs = Array.from(messagesContainer.querySelectorAll('.message'));
            msgs.sort((a, b) => Number(a.dataset.timestamp) - Number(b.dataset.timestamp));
            msgs.forEach(m => messagesContainer.appendChild(m));
        }
    }

    // Initial chat status and admin check
    const { data: chatStatusData } = await supabase
        .from('admin')
        .select('enabled')
        .eq('id', 'chatStatus')
        .single();
    const isAdmin = await checkAdminStatus();
    await updateChatUI(chatStatusData?.enabled, isAdmin);

    // Subscribe to new messages
supabase
    .channel('messages')
    .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
            const { data: currentChatStatus } = await supabase
                .from('admin')
                .select('enabled')
                .eq('id', 'chatStatus')
                .single();
            const isAdminUser = await checkAdminStatus();
            if (currentChatStatus?.enabled || isAdminUser) {
                displayMessage(payload.new, payload.new.id, isAdminUser, currentChatStatus?.enabled);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    )
    .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
            const messageElement = document.querySelector(`#chat-messages .message[data-message-id="${payload.old.id}"]`);
            if (messageElement) {
                messageElement.remove();
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    )
    .subscribe();

    // Listen for chat status changes
    supabase
        .channel('chat_status')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'admin', filter: 'id=eq.chatStatus' },
            async (payload) => {
                const isAdmin = await checkAdminStatus();
                await updateChatUI(payload.new.enabled, isAdmin);
            }
        )
        .subscribe();

    // Listen for ban status
    supabase
        .channel('banned_users')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'banned_users', filter: `id=eq.${currentUser.id}` },
            (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const banReason = payload.new?.reason || null;
                    applyBanToInput(banReason);
                }
            }
        )
        .subscribe();

    // Subscribe to typing indicators
    supabase
        .channel('typing')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'typing' },
            async () => {
                const { data: typers } = await supabase
                    .from('typing')
                    .select('username')
                    .neq('id', currentUser.id);
                const typingContainer = document.getElementById('typing-indicator');

                if (typers && typers.length > 0) {
                    const names = typers.map(typer => typer.username).join(', ');
                    if (!typingContainer) {
                        const typingEl = document.createElement('div');
                        typingEl.id = 'typing-indicator';
                        typingEl.className = 'typing-indicator';
                        messagesContainer.appendChild(typingEl);
                    }
                    document.getElementById('typing-indicator').textContent =
                        `${names} ${typers.length > 1 ? 'are' : 'is'} typing...`;
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                } else if (typingContainer) {
                    typingContainer.remove();
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }
        )
        .subscribe();

    // Update online status
    await supabase
        .from('online')
        .upsert({
            id: currentUser.id,
            username: currentUser.name,
            color: currentUser.color,
            last_active: new Date().toISOString()
        });

    // Update online count every 5 seconds
    setInterval(async () => {
        const cutoff = new Date(Date.now() - 30000).toISOString();
        const { data: onlineUsers, error } = await supabase
            .from('online')
            .select('id')
            .gt('last_active', cutoff);
        if (error) {
            console.error('Error fetching online count:', error);
            document.getElementById('online-count').innerHTML =
                `<i class="fa-solid fa-user-group"></i>&nbsp;1 Live<span class="live-dot"></span>`;
            return;
        }
        document.getElementById('online-count').innerHTML =
            `<i class="fa-solid fa-user-group"></i>&nbsp;${onlineUsers.length} Live<span class="live-dot"></span>`;
    }, 5000);

    // Update online status every 10 seconds
    setInterval(async () => {
        if (currentUser) {
            await supabase
                .from('online')
                .upsert({
                    id: currentUser.id,
                    username: currentUser.name,
                    color: currentUser.color,
                    last_active: new Date().toISOString()
                });
        }
    }, 10000);

    // Cleanup on page exit
    window.addEventListener('beforeunload', async () => {
        await supabase.from('online').delete().eq('id', currentUser.id);
        await supabase.from('typing').delete().eq('id', currentUser.id);
    });

    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    usernameIcon.addEventListener('click', () => {
        const now = Date.now();
        const lastNameChange = currentUser.lastNameChange || 0;
        if (now - lastNameChange < NAME_CHANGE_COOLDOWN) {
            const timeLeftMs = NAME_CHANGE_COOLDOWN - (now - lastNameChange);
            showCooldownPopup(timeLeftMs);
            return;
        }
        document.getElementById('change-username-modal').style.display = 'block';
        document.getElementById('change-username-input').focus();
    });

    document.getElementById('change-username-update').addEventListener('click', changeUsername);
    document.getElementById('change-username-cancel').addEventListener('click', () => {
        document.getElementById('change-username-modal').style.display = 'none';
        document.getElementById('change-username-input').value = '';
    });
    document.getElementById('change-username-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') changeUsername();
    });

    let lastTypingUpdate = 0;
    const TYPING_DEBOUNCE = 1000;
    messageInput.addEventListener('input', async () => {
        const now = Date.now();
        if (now - lastTypingUpdate >= TYPING_DEBOUNCE) {
            await supabase
                .from('typing')
                .upsert({
                    id: currentUser.id,
                    username: currentUser.name,
                    timestamp: new Date().toISOString()
                });
            lastTypingUpdate = now;
        }
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(async () => {
            await supabase.from('typing').delete().eq('id', currentUser.id);
        }, TYPING_TIMEOUT_LENGTH);
    });

    // Cleanup old messages and typing entries
    setInterval(cleanupOldMessages, 10 * 60 * 1000); // 30-minute cleanup
    setInterval(cleanupOldTypingEntries, 60 * 1000);
    cleanupOldMessages();
    cleanupOldTypingEntries();

    // Message cleanup timer
    function startMessageCleanupTimer() {
      setInterval(() => {
        const messages = document.querySelectorAll('.message');
        const now = Date.now();
        messages.forEach(msg => {
          if (now - parseInt(msg.dataset.timestamp) > MESSAGE_LIFETIME) {
            msg.remove();
          }
        });
      }, 60000); // Check every minute
    }
    startMessageCleanupTimer();

    // Scroll to Bottom Button Logic
    const chatMessagesContainer = document.getElementById('chat-messages');
    const scrollToBottomBtn = document.getElementById('scroll-to-bottom-btn');

    if (chatMessagesContainer && scrollToBottomBtn) {
        chatMessagesContainer.addEventListener('scroll', () => {
            // Show button if scrolled up more than 200px from bottom
            if (chatMessagesContainer.scrollHeight - chatMessagesContainer.scrollTop > chatMessagesContainer.clientHeight + 50) {
                scrollToBottomBtn.classList.add('show');
            } else {
                scrollToBottomBtn.classList.remove('show');
            }
        });

        scrollToBottomBtn.addEventListener('click', () => {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        });
    }

  async function handleSendMessage() {
    if (!canSendMessage) {
      showModernWarning('Slow Down!', 'You are sending messages too fast. Please wait.', '#FF4444');
      return;
    }

    canSendMessage = false;
    setTimeout(() => {
      canSendMessage = true;
    }, MESSAGE_COOLDOWN);

    await _sendMessage();
  }

    // --- Pinned Message Logic ---
    function displayPinnedMessage(message) {
        pinnedMessageContainer.innerHTML = '';
        if (message && message.url) {
            const pinElement = document.createElement('div');
            pinElement.className = 'pinned-message';
            pinElement.innerHTML = `
                <div class="pinned-message-header">📌 Pinned</div>
                <div class="pinned-message-content">${message.url}</div>
            `;
            pinnedMessageContainer.appendChild(pinElement);
        }
    }

    async function fetchPinnedMessage() {
        const { data, error } = await supabase
            .from('admin')
            .select('url')
            .eq('id', 'pinnedMessage')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching pinned message:', error);
        } else {
            displayPinnedMessage(data);
        }
    }

    supabase
        .channel('pinned_message_updates_client')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'admin', filter: 'id=eq.pinnedMessage' },
            (payload) => {
                if (payload.eventType === 'DELETE') {
                    displayPinnedMessage(null);
                } else {
                    displayPinnedMessage(payload.new);
                }
            }
        )
        .subscribe();
    // --- End Pinned Message Logic ---

    /* ------------------------------ Poll Logic ------------------------------ */
    const pollContainer = document.getElementById('poll-container');
    let activePollId = null;
    let voteSubscription = null;

    function adjustChatHeight(hasPoll) {
      const liveChat = document.querySelector('.live-chat');
      if (!liveChat) return;
  
      const isMobile = window.innerWidth <= 768; // Example breakpoint for mobile
  
      if (hasPoll) {
          liveChat.style.maxHeight = isMobile ? '90vh' : '105vh'; // Different heights for mobile and PC
      } else {
          liveChat.style.maxHeight = isMobile ? '60vh' : '70vh'; // Different heights for mobile and PC
      }
  }

    function clearPollUI() {
        pollContainer.innerHTML = '';
        adjustChatHeight(false);
        activePollId = null;
        if (voteSubscription) {
            supabase.removeChannel(voteSubscription);
            voteSubscription = null;
        }
    }

    async function renderPoll(poll) {
        if (!poll) {
            clearPollUI();
            return;
        }

        activePollId = poll.id;
        pollContainer.innerHTML = '';

        const pollWrapper = document.createElement('div');
        pollWrapper.className = 'poll-message';

        const header = document.createElement('div');
        header.className = 'pinned-message-header poll-header-collapsible';
        header.innerHTML = '📊 Poll <i class="fas fa-chevron-up collapse-icon"></i>';
        header.addEventListener('click', () => {
            pollWrapper.classList.toggle('collapsed');
            const collapseIcon = header.querySelector('.collapse-icon');
            if (pollWrapper.classList.contains('collapsed')) {
                collapseIcon.classList.remove('fa-chevron-up');
                collapseIcon.classList.add('fa-chevron-down');
            } else {
                collapseIcon.classList.remove('fa-chevron-down');
                collapseIcon.classList.add('fa-chevron-up');
            }
        });

        const questionEl = document.createElement('div');
        questionEl.className = 'poll-question';
        questionEl.textContent = poll.question;

        const optionsWrapper = document.createElement('div');
        optionsWrapper.className = 'poll-options';

        const options = [poll.option1, poll.option2, poll.option3, poll.option4].filter(Boolean);

        // Placeholders for buttons to update counts later
        const buttonRefs = [];

        options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'poll-option-btn';
            btn.innerHTML = `<span class="poll-label">${opt}</span><span class="poll-count">0</span><div class="poll-bar"></div>`;
            btn.addEventListener('click', () => handleVote(idx, btn));
            buttonRefs.push(btn);
            optionsWrapper.appendChild(btn);
        });

        pollWrapper.appendChild(header);
        pollWrapper.appendChild(questionEl);
        pollWrapper.appendChild(optionsWrapper);

        // Add initial collapsed state if needed (e.g., from local storage)
        // pollWrapper.classList.add('collapsed'); // Uncomment to start collapsed

        pollContainer.appendChild(pollWrapper);

        adjustChatHeight(true);

        // Initial vote counts + voted state
        await updateVoteUI(buttonRefs);

        // subscribe to vote changes for this poll
        if (voteSubscription) supabase.removeChannel(voteSubscription);
        voteSubscription = supabase
            .channel(`poll_votes_${activePollId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes', filter: `poll_id=eq.${activePollId}` }, () => updateVoteUI(buttonRefs))
            .subscribe();
    }

    async function updateVoteUI(buttonRefs) {
        if (!activePollId) return;

        // Fetch all votes for this poll
        const { data: votes, error: voteErr } = await supabase
            .from('poll_votes')
            .select('option_index, user_id')
            .eq('poll_id', activePollId);

        if (voteErr) {
            console.error('Vote fetch error:', voteErr);
            return;
        }

        // Compute counts
        const counts = Array(buttonRefs.length).fill(0);
        let userVoteIndex = null;
        votes.forEach(v => {
            counts[v.option_index]++;
            if (v.user_id === currentUser.id) userVoteIndex = v.option_index;
        });

        // Update UI
        const total = counts.reduce((a,b)=>a+b,0) || 1;
        buttonRefs.forEach((btn, idx) => {
            const span = btn.querySelector('.poll-count');
            if (span) span.textContent = `(${counts[idx]})`;
            const bar = btn.querySelector('.poll-bar');
            if (bar) bar.style.width = `${(counts[idx]/total)*100}%`;
            if (userVoteIndex !== null) {
                btn.disabled = true;
                if (idx === userVoteIndex) btn.classList.add('voted');
            }
        });

        // Automatically collapse poll for users who have already voted
        const pollWrapper = document.querySelector('#poll-container .poll-message');
        if (userVoteIndex !== null && pollWrapper && !pollWrapper.classList.contains('collapsed')) {
            pollWrapper.classList.add('collapsed');
            const collapseIcon = pollWrapper.querySelector('.collapse-icon');
            if (collapseIcon) {
                collapseIcon.classList.remove('fa-chevron-up');
                collapseIcon.classList.add('fa-chevron-down');
            }
        }
    }

    async function handleVote(optionIndex, buttonEl) {
        if (!activePollId) return;
        try {
            const { error } = await supabase.from('poll_votes').insert({
                poll_id: activePollId,
                user_id: currentUser.id,
                option_index: optionIndex,
            });

            if (error) {
                if (error.code === '23505') {
                    showModernWarning('⚠️ Already Voted', 'You have already voted in this poll.', '#FF4444');
                } else {
                    showModernWarning('⚠️ Error', 'Vote failed: ' + error.message, '#FF4444');
                }
                return;
            }

            // Indicate vote recorded
            await updateVoteUI(Array.from(pollContainer.querySelectorAll('.poll-option-btn')));
        } catch (err) {
            console.error('Vote error:', err);
        }
    }

    async function fetchActivePoll() {
        const { data: pollData, error: pollErr } = await supabase
            .from('polls')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (pollErr && pollErr.code !== 'PGRST116') {
            console.error('Error fetching poll:', pollErr);
            return;
        }
        renderPoll(pollData);
    }

    // Real-time poll updates
    supabase
        .channel('client_poll_updates')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'polls' },
            () => fetchActivePoll()
        )
        .subscribe();

    // Initial poll fetch
    fetchActivePoll();

    /* --------------------------- End Poll Logic --------------------------- */

    // Initial data fetch
    fetchPinnedMessage();

    // Set up intervals

    // Start message cleanup timer
    startMessageCleanupTimer();
  }

async function cleanupOldMessages() {
    try {
        const cutoff = new Date(Date.now() - MESSAGE_LIFETIME).toISOString();
        await supabase
            .from('messages')
            .delete()
            .lt('timestamp', cutoff);
        console.log('Old messages cleanup completed');
    } catch (error) {
        console.error('Error cleaning up old messages:', error);
    }
}

  async function cleanupOldTypingEntries() {
    const cutoff = new Date(Date.now() - TYPING_TIMEOUT_LENGTH).toISOString();
    try {
      await supabase
        .from('typing')
        .delete()
        .lt('timestamp', cutoff);
      console.log('Old typing entries cleanup completed');
    } catch (error) {
      console.error('Error cleaning up old typing entries:', error);
    }
  }

  async function cleanupExpiredTimeouts() {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('user_timeouts')
        .delete()
        .lt('timeout_end', now);
      
      if (!error) {
        console.log('Expired timeout entries cleanup completed');
      }
    } catch (error) {
      console.error('Error cleaning up expired timeouts:', error);
    }
  }

  function startMessageCleanupTimer() {
    // Run cleanup every 5 minutes (300,000 ms)
    setInterval(async () => {
      await cleanupOldMessages();
      await cleanupOldTypingEntries();
      await cleanupExpiredTimeouts();
    }, 5 * 60 * 1000);
    
    // Run initial cleanup after 30 seconds
    setTimeout(async () => {
      await cleanupOldMessages();
      await cleanupOldTypingEntries();
      await cleanupExpiredTimeouts();
    }, 30 * 1000);
  }

  async function checkAdminStatus() {
    const { data } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', currentUser.id)
      .single();
    return !!data;
  }

  function isAdminMessageSync(userId) {
    return false;
  }

  async function isAdminMessage(userId) {
    const { data } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    return !!data;
  }

  let canSendMessage = true;
  const MESSAGE_COOLDOWN = 3000; // 3 seconds cooldown

  async function _sendMessage() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    let message = messageInput.value.trim();

    if (!message || !currentUser) return;

    // Check ban
    const { data: banned } = await supabase
      .from('banned_users')
      .select('id, reason')
      .eq('id', currentUser.id)
      .single();
    if (banned) {
      applyBanToInput(banned.reason);
      return;
    }

    // Check timeout
    const { data: timeout } = await supabase
      .from('user_timeouts')
      .select('timeout_end')
      .eq('id', currentUser.id)
      .single();
    if (timeout && new Date(timeout.timeout_end).getTime() > Date.now()) {
      applyTimeoutToInput(new Date(timeout.timeout_end).getTime() - Date.now());
      return;
    } else if (timeout) {
      await supabase.from('user_timeouts').delete().eq('id', currentUser.id);
    }

    // Check chat status and admin privileges
    const { data: chatStatusData } = await supabase
      .from('admin')
      .select('enabled')
      .eq('id', 'chatStatus')
      .single();
    const isAdmin = await checkAdminStatus();
    if (!chatStatusData?.enabled) {
      showModernWarning('⚠️ Chat Disabled', 'Chat is currently disabled by an admin.', '#FF4444');
      return;
    }

    // Check for blocked content
    const containsURL = BLOCKED_URL_PATTERNS.some(pattern =>
      new RegExp(pattern.source, pattern.flags).test(message)
    );
    const containsBlockedWord = BLOCKED_WORDS.some(word =>
      new RegExp(`\\b${word}\\b`, 'i').test(message)
    );

    if (!lastMessages[currentUser.id]) {
      lastMessages[currentUser.id] = { last: '', count: 0 };
    }

    const lastRec = lastMessages[currentUser.id];
    const isDuplicate = message.toLowerCase() === lastRec.last.toLowerCase();

    if (isDuplicate) {
      lastRec.count = (lastRec.count || 0) + 1; // increment on each repeat
    } else {
      lastRec.last = message;      // new content resets the counter
      lastRec.count = 0;
    }

    lastMessages[currentUser.id] = lastRec;
    localStorage.setItem('lastMessages', JSON.stringify(lastMessages));

    const duplicateViolation = isDuplicate && lastRec.count >= DUPLICATE_THRESHOLD;

    if (containsURL || containsBlockedWord || duplicateViolation) {
      if (!userWarnings[currentUser.id]) {
        userWarnings[currentUser.id] = 0;
        userTimeoutLevel[currentUser.id] = 0;
        userCleanMessages[currentUser.id] = 0;
        userTimeoutEnd[currentUser.id] = 0;
      }

      userCleanMessages[currentUser.id] = 0;
      userWarnings[currentUser.id]++;

      localStorage.setItem('userWarnings', JSON.stringify(userWarnings));
      localStorage.setItem('userCleanMessages', JSON.stringify(userCleanMessages));
      localStorage.setItem('userTimeoutLevel', JSON.stringify(userTimeoutLevel));
      localStorage.setItem('userTimeoutEnd', JSON.stringify(userTimeoutEnd));

      if (userWarnings[currentUser.id] <= MAX_WARNINGS) {
        showModernWarning(
          `⚠️ Warning ${userWarnings[currentUser.id]}/${MAX_WARNINGS}`,
          `Please don't send ${containsURL ? 'URLs' : containsBlockedWord ? 'inappropriate content' : 'repeated messages'} in chat.`,
          '#FFA500'
        );
        messageInput.value = '';
        return;
      } else {
        const timeoutLevel = userTimeoutLevel[currentUser.id] || 0;
        const timeoutDuration = timeoutLevel === 0 ? INITIAL_TIMEOUT : timeoutLevel === 1 ? ESCALATED_TIMEOUT : EXTENDED_TIMEOUT;

        userTimeoutEnd[currentUser.id] = Date.now() + timeoutDuration;
        localStorage.setItem('userTimeoutEnd', JSON.stringify(userTimeoutEnd));
        applyTimeoutToInput(timeoutDuration);

        await supabase
          .from('user_timeouts')
          .upsert({
            id: currentUser.id,
            timeout_end: new Date(Date.now() + timeoutDuration).toISOString()
          });

        showModernWarning(
          `⏳ You've been timed out`,
          `You cannot chat for ${timeoutDuration / 60000} minutes due to repeated violations.`,
          '#FF4444'
        );

        userTimeoutLevel[currentUser.id] = timeoutLevel + 1;
        localStorage.setItem('userTimeoutLevel', JSON.stringify(userTimeoutLevel));

        messageInput.value = '';
        return;
      }
    }

    if (!userCleanMessages[currentUser.id]) {
      userCleanMessages[currentUser.id] = 0;
    }
    userCleanMessages[currentUser.id]++;

    if (userCleanMessages[currentUser.id] >= CLEAN_MESSAGES_TO_RESET && userWarnings[currentUser.id] > 0) {
      userWarnings[currentUser.id] = 0;
      userTimeoutLevel[currentUser.id] = 0;
      userTimeoutEnd[currentUser.id] = 0;
      localStorage.setItem('userWarnings', JSON.stringify(userWarnings));
      localStorage.setItem('userTimeoutLevel', JSON.stringify(userTimeoutLevel));
      localStorage.setItem('userTimeoutEnd', JSON.stringify(userTimeoutEnd));
    }

    localStorage.setItem('userCleanMessages', JSON.stringify(userCleanMessages));

    messageInput.disabled = true;
    sendButton.disabled = true;
    messageInput.placeholder = 'Please wait 10 seconds...';
    sendButton.style.opacity = '0.5';

    try {
      await supabase
        .from('messages')
        .insert({
          user_id: currentUser.id,
          username: currentUser.name,
          text: message,
          color: currentUser.color,
          timestamp: new Date().toISOString()
        });

      await supabase.from('typing').delete().eq('id', currentUser.id);
      messageInput.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
      showModernWarning(
        "⚠️ Error",
        "Failed to send message. Please try again.",
        '#FF4444'
      );
    }

    setTimeout(() => {
      const isBanned = async () => {
        const { data } = await supabase
          .from('banned_users')
          .select('id, reason')
          .eq('id', currentUser.id)
          .single();
        return data ? { banned: true, reason: data.reason } : { banned: false, reason: null };
      };
      const checkChatStatus = async () => {
        const { data: status } = await supabase
          .from('admin')
          .select('enabled')
          .eq('id', 'chatStatus')
          .single();
        return status?.enabled;
      };
      Promise.all([isBanned(), checkChatStatus(), checkAdminStatus()]).then(([banResult, chatEnabled, isAdmin]) => {
        if (!banResult.banned && (chatEnabled || isAdmin)) {
          messageInput.disabled = false;
          sendButton.disabled = false;
          messageInput.removeAttribute('disabled');
          messageInput.placeholder = 'Chat Now...';
        }
        sendButton.style.opacity = '1';
      });
    }, 10000);
  }

  async function changeUsername() {
    const newUsername = document.getElementById('change-username-input').value.trim();
    
    // Hardcoded restricted words for usernames only
    const RESTRICTED_USERNAME_WORDS = [
      'admin', 'mod', 'owner', 'moderator', 'administrator'
    ];

    // Function to check for restricted word variations
    function containsRestrictedWord(username) {
      // Remove all spaces and special characters for comparison
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      return RESTRICTED_USERNAME_WORDS.some(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Only block if restricted word appears as standalone or with obvious modifications
        // This prevents blocking legitimate names like "pramod", "ahmad", etc.
        
        // Pattern 1: Exact match (e.g., "mod")
        if (cleanUsername === cleanWord) return true;
        
        // Pattern 2: Word + numbers (e.g., "mod123", "admin456")
        if (cleanUsername.startsWith(cleanWord) && /^[0-9]+$/.test(cleanUsername.slice(cleanWord.length))) {
          return true;
        }
        
        // Pattern 3: Numbers + word (e.g., "123mod", "456admin")
        if (cleanUsername.endsWith(cleanWord) && /^[0-9]+$/.test(cleanUsername.slice(0, -cleanWord.length))) {
          return true;
        }
        
        // Pattern 4: Word + short suffix (e.g., "modx", "admin1", "mod_")
        if (cleanUsername.startsWith(cleanWord) && cleanUsername.length <= cleanWord.length + 2) {
          return true;
        }
        
        // Pattern 5: Short prefix + word (e.g., "xmod", "1admin")
        if (cleanUsername.endsWith(cleanWord) && cleanUsername.length <= cleanWord.length + 2) {
          return true;
        }
        
        return false;
      });
    }

    if (newUsername.length < 3) {
      showModernWarning('⚠️ Invalid Username', 'Username must be at least 3 characters', '#FF4444');
      return;
    }

    if (newUsername.length > 20) {
      showModernWarning('⚠️ Invalid Username', 'Username must be less than 20 characters', '#FF4444');
      return;
    }
    
    // Check for restricted words (only if not admin)
    const isAdmin = await checkAdminStatus();

    if (!isAdmin && containsRestrictedWord(newUsername)) {
      showModernWarning('🚫 Restricted Username', 'This username resembles a staff title', '#FF0000');
      return;
    }

    // Then check for blocked words
    const containsBlockedWord = BLOCKED_WORDS.some(word => 
      newUsername.toLowerCase().includes(word.toLowerCase())
    );
    
    if (containsBlockedWord) {
      showModernWarning('⚠️ Invalid Username', 'Username contains inappropriate content', '#FF4444');
      return;
    }

    if (newUsername === currentUser.name) {
      showModernWarning('⚠️ No Change', 'New username must be different from current one', '#FFA500');
      return;
    }

    try {
      const newColor = await getUniqueColor();
      await supabase
        .from('online')
        .update({
          username: newUsername,
          color: newColor,
          last_active: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .eq('user_id', currentUser.id);
      for (const msg of messages) {
        await supabase
          .from('messages')
          .update({ username: newUsername, color: newColor })
          .eq('id', msg.id);
      }

      currentUser.name = newUsername;
      currentUser.color = newColor;
      currentUser.lastNameChange = Date.now();
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      const messagesContainer = document.getElementById('chat-messages');
      const messageElements = messagesContainer.getElementsByClassName('message');
      for (let messageEl of messageElements) {
        const usernameSpan = messageEl.querySelector('.message-username');
        if (usernameSpan && usernameSpan.textContent === `${currentUser.name}:`) {
          usernameSpan.textContent = `${newUsername}:`;
          usernameSpan.style.color = newColor;
        }
      }

      const typingContainer = document.getElementById('typing-indicator');
      if (typingContainer && typingContainer.textContent.includes(currentUser.name)) {
        const typers = typingContainer.textContent.split(', ').map(name =>
          name === currentUser.name ? newUsername : name
        );
        typingContainer.textContent =
          `${typers.join(', ')} ${typers.length > 1 ? 'are' : 'is'} typing...`;
      }

      const usernameIcon = document.getElementById('change-username-icon');
      usernameIcon.style.color = newColor;

      document.getElementById('change-username-modal').style.display = 'none';
      document.getElementById('change-username-input').value = '';
      showModernWarning('✅ Username Changed', 'Your username has been updated successfully!', '#4CAF50');
    } catch (error) {
      console.error('Error changing username:', error);
      showModernWarning('⚠️ Error', 'Failed to change username. Please try again.', '#FF4444');
    }
  }

  function showCooldownPopup(timeLeftMs) {
    const popup = document.getElementById('cooldown-popup');
    const timerElement = document.getElementById('cooldown-timer');
    const okButton = document.getElementById('cooldown-ok-button');

    const minutesLeft = Math.floor(timeLeftMs / 1000 / 60);
    const secondsLeft = Math.floor((timeLeftMs / 1000) % 60);

    timerElement.textContent = `${minutesLeft}m ${secondsLeft}s`;
    popup.classList.add('active');

    const timerInterval = setInterval(() => {
      timeLeftMs -= 1000;

      if (timeLeftMs <= 0) {
        clearInterval(timerInterval);
        popup.classList.remove('active');
        return;
      }

      const minutes = Math.floor(timeLeftMs / 1000 / 60);
      const seconds = Math.floor((timeLeftMs / 1000) % 60);
      timerElement.textContent = `${minutes}m ${seconds}s`;
    }, 1000);

    okButton.onclick = () => {
      clearInterval(timerInterval);
      popup.classList.remove('active');
    };

    popup.onclick = (e) => {
      if (e.target === popup) {
        clearInterval(timerInterval);
        popup.classList.remove('active');
      }
    };
  }

  function applyBanToInput(banReason = null) {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    messageInput.disabled = true;
    sendButton.disabled = true;
    messageInput.placeholder = BANNED_MESSAGE;

    const warningMessage = banReason 
      ? `Reason: ${banReason}<br>Contact Admin on Telegram` 
      : "Contact Admin on Telegram";

    showModernWarning(
      "⚠️ Account Banned",
      warningMessage,
      '#FF4444'
    );
  }

  function applyTimeoutToInput(duration) {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    messageInput.disabled = true;
    sendButton.disabled = true;

    const endTime = new Date(Date.now() + duration);

    const updateCountdown = () => {
      const now = new Date();
      const remaining = Math.max(0, endTime - now);

      if (remaining <= 0) {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.placeholder = 'Chat Now...';
        userTimeoutEnd[currentUser.id] = 0;
        localStorage.setItem('userTimeoutEnd', JSON.stringify(userTimeoutEnd));
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      messageInput.placeholder = `⏳ Timeout: ${minutes}m ${seconds}s remaining...`;

      if (remaining > 0) {
        setTimeout(updateCountdown, 1000);
      }
    };

    updateCountdown();
  }

  function showModernWarning(title, message, color) {
    const warningContainer = document.createElement('div');
    warningContainer.className = 'modern-warning';
    warningContainer.style.backgroundColor = color;

    const emojiMatch = title.match(/^[^\s]+/);
    const emoji = emojiMatch ? emojiMatch[0] : '';
    const titleText = title.replace(/^[^\s]+\s*/, '');

    warningContainer.innerHTML = `
      <div class="warning-header">
        <span class="warning-icon">${emoji}</span>
        <span class="warning-title">${titleText}</span>
      </div>
      <div class="warning-message" style="word-wrap: break-word; white-space: pre-wrap;">${message}</div>
      <div class="warning-progress"></div>
    `;

    document.body.appendChild(warningContainer);

    const progressBar = warningContainer.querySelector('.warning-progress');
    progressBar.style.width = '100%';
    progressBar.style.transition = 'width 5s linear';

    setTimeout(() => {
      progressBar.style.width = '0%';
    }, 10);

    setTimeout(() => {
      warningContainer.style.opacity = '0';
      warningContainer.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        warningContainer.remove();
      }, 300);
    }, 4000);
  }

async function displayMessage(message, messageId, isCurrentUserAdmin, isChatEnabled) {
    const messagesContainer = document.getElementById('chat-messages');
    const isSenderAdmin = await isAdminMessage(message.user_id);

    if (isCurrentUserAdmin || isChatEnabled) {
        if (document.querySelector(`.message[data-message-id="${messageId}"]`)) {
            return; // avoid duplicates
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        if (isSenderAdmin) {
            messageElement.classList.add('admin-message');
        }
        messageElement.dataset.userId = message.user_id;
        messageElement.dataset.messageId = messageId;
        
        // Cap timestamp at current time to prevent future-dated messages
        const messageTime = message.timestamp ? new Date(message.timestamp) : new Date();
        const currentTime = new Date();
        const cappedTimestamp = messageTime > currentTime ? currentTime : messageTime;
        
        messageElement.dataset.timestamp = cappedTimestamp.getTime();
        const displayTime = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <span class="message-username" style="color: ${message.color || '#ffcc00'}">
                ${isSenderAdmin ? '<i class="fas fa-crown"></i> ' : ''}${message.username}:
            </span>
            <span class="message-text">${message.text}</span>
            <span class="message-time">${displayTime}</span>
        `;

        // Insert message in the correct order based on CAPPED timestamp
        const existing = Array.from(messagesContainer.querySelectorAll('.message'));
        const ts = Number(messageElement.dataset.timestamp);
        let inserted = false;
        for (let i = 0; i < existing.length; i++) {
            const cmpTs = Number(existing[i].dataset.timestamp);
            if (ts < cmpTs) {
                messagesContainer.insertBefore(messageElement, existing[i]);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            messagesContainer.appendChild(messageElement);
        }

        // Scroll to bottom for new messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Collapse/expand Live Chat
  const chatHeader = document.querySelector('.chat-header');
  const liveChat = document.querySelector('.live-chat');
  const collapseIcon = chatHeader.querySelector('.collapse-icon');
  chatHeader.style.cursor = 'pointer';
  chatHeader.addEventListener('click', () => {
    const isCollapsed = liveChat.classList.toggle('collapsed');
    if (isCollapsed) {
      collapseIcon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    } else {
      collapseIcon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
  });

}

// Initialize chat system when DOM is ready or immediately if DOM is already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatSystem);
} else {
  // DOM is already ready, initialize immediately
  initializeChatSystem();
}