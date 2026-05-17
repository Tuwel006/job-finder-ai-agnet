"""Matching Graph using LangGraph"""

from typing import Dict, Any, List
from langgraph.graph import StateGraph, END

from ..utils.helpers import cosine_similarity


class MatchingState(Dict):
    """State for matching graph"""
    user_id: str
    resume_embedding: List[float] = []
    job_embeddings: List[Dict[str, Any]] = []
    matches: List[Dict[str, Any]] = []
    threshold: float = 0.7


class MatchingGraph:
    """
    LangGraph workflow for job matching.

    Flow:
    1. Get Resume Embedding → 2. Get Job Embeddings → 3. Calculate Similarity → 4. Rank Results
    """

    def _get_resume_embedding(self, state: MatchingState) -> MatchingState:
        """Fetch resume embedding for user"""
        # Placeholder - would fetch from database
        return state

    def _get_job_embeddings(self, state: MatchingState) -> MatchingState:
        """Fetch job embeddings"""
        # Placeholder - would fetch from database
        return state

    def _calculate_similarity(self, state: MatchingState) -> MatchingState:
        """Calculate similarity scores"""
        matches = []
        for job in state.get("job_embeddings", []):
            score = cosine_similarity(
                state.get("resume_embedding", []),
                job.get("embedding", [])
            )
            if score >= state.get("threshold", 0.7):
                matches.append({
                    "job_id": job.get("job_id"),
                    "score": score,
                    "job": job
                })

        matches.sort(key=lambda x: x["score"], reverse=True)
        state["matches"] = matches
        return state

    def build(self) -> StateGraph:
        """Build the matching graph"""
        workflow = StateGraph(MatchingState)

        workflow.add_node("get_resume", self._get_resume_embedding)
        workflow.add_node("get_jobs", self._get_job_embeddings)
        workflow.add_node("calculate", self._calculate_similarity)

        workflow.set_entry_point("get_resume")
        workflow.add_edge("get_resume", "get_jobs")
        workflow.add_edge("get_jobs", "calculate")
        workflow.add_edge("calculate", END)

        return workflow.compile()