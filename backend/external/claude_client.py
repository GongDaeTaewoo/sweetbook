import anthropic
import json
import re
from core.config import settings
from external.linky_mock import get_daily_mock, get_weekly_mock, get_monthly_mock


def _parse_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise

claude = anthropic.Anthropic(api_key=settings.claude_api_key)

LINKY_SYSTEM_PROMPT = """
너는 '링키'야. 우울증을 겪고 있는 사람의 일기를 읽고 따뜻하게 반응하는 AI 친구야.

성격:
- 귀엽고 밝지만 억지스럽지 않아
- 판단하지 않고 있는 그대로 받아들여
- 짧고 따뜻한 말로 위로해
- 사용자의 작은 변화도 놓치지 않고 칭찬해

규칙:
- 절대 "당신" 대신 "너"나 "당신" 중 일관되게 써 (여기선 "당신" 사용)
- 과도한 긍정은 금지. 힘든 감정을 부정하지 마
- 전문 상담사처럼 굴지 마. 그냥 옆에 있는 친구처럼
- 응답은 반드시 JSON으로만. 다른 텍스트 없이.
"""

LINKY_DAILY_PROMPT = """
아래 일기를 읽고 JSON으로만 응답해줘.

기분 점수: {mood}/5 (1=매우 힘듦, 5=좋음)
일기 내용: {content}

응답 형식:
{{
  "oneline": "오늘 하루를 한 문장으로 표현한 것 (20자 이내)",
  "cheer": "따뜻한 격려 메시지 (50자 이내)"
}}
"""

LINKY_WEEKLY_PROMPT = """
이번 주 일기들을 읽고 JSON으로만 응답해줘.

일기 목록:
{diary_summary}

응답 형식:
{{
  "oneline": "이번 주를 한 문장으로 표현한 것 (20자 이내)",
  "cheer": "이번 주 변화에 대한 따뜻한 격려 (70자 이내)"
}}
"""

LINKY_MONTHLY_PROMPT = """
이번 달 일기들을 읽고 JSON으로만 응답해줘.

일기 목록:
{diary_summary}

응답 형식:
{{
  "oneline": "이번 달을 한 문장으로 표현한 것 (20자 이내)",
  "cheer": "한 달 동안의 여정에 대한 따뜻한 격려 (100자 이내)"
}}
"""


def ask_linky_daily(mood: int, content: str) -> dict:
    if settings.mock_mode:
        return get_daily_mock()
    prompt = LINKY_DAILY_PROMPT.format(mood=mood, content=content or "내용 없음")
    message = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system=LINKY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return _parse_json(message.content[0].text)


def ask_linky_weekly(diaries: list) -> dict:
    if settings.mock_mode:
        return get_weekly_mock()
    diary_summary = "\n".join(
        f"- {d.written_at} (기분 {d.mood}/5): {d.content[:80]}" for d in diaries
    )
    prompt = LINKY_WEEKLY_PROMPT.format(diary_summary=diary_summary)
    message = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        system=LINKY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return _parse_json(message.content[0].text)


def ask_linky_monthly(diaries: list) -> dict:
    if settings.mock_mode:
        return get_monthly_mock()
    diary_summary = "\n".join(
        f"- {d.written_at} (기분 {d.mood}/5): {d.content[:80]}" for d in diaries
    )
    prompt = LINKY_MONTHLY_PROMPT.format(diary_summary=diary_summary)
    message = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        system=LINKY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return _parse_json(message.content[0].text)
