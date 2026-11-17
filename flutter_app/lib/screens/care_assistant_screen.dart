import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../services/api_service.dart';

class CareAssistantScreen extends StatefulWidget {
  final UserProfile profile;
  final String? initialCropContext;

  const CareAssistantScreen({
    super.key,
    required this.profile,
    this.initialCropContext,
  });

  @override
  State<CareAssistantScreen> createState() => _CareAssistantScreenState();
}

class _CareAssistantScreenState extends State<CareAssistantScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<Map<String, String>> _messages = [];
  bool _sending = false;

  static const _starterQuestions = [
    'Why are my plant leaves turning yellow?',
    'How often should I water tomatoes?',
    'What causes leaf spots?',
    'How can I improve soil fertility?',
    'How do I prevent fungal infections?',
  ];

  @override
  void initState() {
    super.initState();
    _messages.add({
      'role': 'model',
      'text': widget.initialCropContext != null
          ? 'Ask me any plant care, watering, soil, or pest question about ${widget.initialCropContext}.'
          : 'Hello ${widget.profile.name}! Ask me anything about crop care, yellowing leaves, watering schedules, soil fertility, or disease prevention.',
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _send(String text) async {
    final question = text.trim();
    if (question.isEmpty || _sending) return;

    setState(() {
      _messages.add({'role': 'user', 'text': question});
      _sending = true;
    });
    _controller.clear();
    _scrollToBottom();

    try {
      final api = ApiService(customBaseUrl: widget.profile.customServerUrl);
      final answer = await api.askCareAssistant(
        question: question,
        history: _messages.take(_messages.length - 1).toList(),
        cropContext: widget.initialCropContext,
      );
      if (!mounted) return;
      setState(() => _messages.add({'role': 'model', 'text': answer}));
    } catch (e) {
      if (!mounted) return;
      setState(() => _messages.add({'role': 'model', 'text': 'Error: $e'}));
    } finally {
      if (mounted) {
        setState(() => _sending = false);
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 220),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6FAF6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6FAF6),
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Plant Care Assistant',
          style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF0F2417)),
        ),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 46,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _starterQuestions.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final q = _starterQuestions[i];
                return ActionChip(
                  label: Text(q, style: const TextStyle(fontSize: 12)),
                  backgroundColor: Colors.white,
                  side: const BorderSide(color: Color(0xFFDCE8DE)),
                  onPressed: _sending ? null : () => _send(q),
                );
              },
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_sending ? 1 : 0),
              itemBuilder: (_, index) {
                if (_sending && index == _messages.length) {
                  return const Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                          SizedBox(width: 10),
                          Text('Consulting agricultural assistant...'),
                        ],
                      ),
                    ),
                  );
                }
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.82,
                    ),
                    decoration: BoxDecoration(
                      color: isUser ? const Color(0xFF14532D) : Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: isUser ? null : Border.all(color: const Color(0xFFDCE8DE)),
                    ),
                    child: Text(
                      msg['text'] ?? '',
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.45,
                        color: isUser ? Colors.white : const Color(0xFF0F2417),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Color(0xFFDCE8DE))),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textInputAction: TextInputAction.send,
                      onSubmitted: _send,
                      decoration: InputDecoration(
                        hintText: 'Ask a plant care question...',
                        filled: true,
                        fillColor: const Color(0xFFF6FAF6),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  IconButton.filled(
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFF16A34A),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(48, 48),
                    ),
                    onPressed: _sending ? null : () => _send(_controller.text),
                    icon: const Icon(Icons.send_rounded),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
