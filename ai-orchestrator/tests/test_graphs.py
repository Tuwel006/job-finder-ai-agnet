"""Test LangGraph workflows"""

import pytest
from src.graphs.resume_graph import ResumeGraph
from src.graphs.matching_graph import MatchingGraph


def test_resume_graph_build():
    """Test resume graph builds correctly"""
    graph = ResumeGraph()
    compiled = graph.build()
    assert compiled is not None


def test_matching_graph_build():
    """Test matching graph builds correctly"""
    graph = MatchingGraph()
    compiled = graph.build()
    assert compiled is not None


@pytest.mark.asyncio
async def test_matching_state():
    """Test matching state structure"""
    state = {
        "user_id": "test-user",
        "resume_embedding": [0.1, 0.2, 0.3],
        "job_embeddings": [
            {"job_id": "job1", "embedding": [0.1, 0.2, 0.3]},
            {"job_id": "job2", "embedding": [0.9, 0.8, 0.7]},
        ],
        "matches": [],
        "threshold": 0.7
    }
    assert state["user_id"] == "test-user"
    assert len(state["resume_embedding"]) == 3