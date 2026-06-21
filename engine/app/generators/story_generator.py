class StoryGenerator:
    def __init__(self):
        pass

    def generate(self, dna, health):
        return (
            f"Based on your recent transactional history, your behavioral archetype maps to '{dna.profile_name}'. "
            f"Your overall structural health score is {health.overall_score}/100 (Grade {health.grade}). "
            "The deterministic engine has mapped your cash flow and identified key areas for capital efficiency optimization."
        )