"""Test agent registration and creation"""

import pytest
from src.agents.base_agent import BaseAgent, AgentConfig
from src.agents.agent_registry import AgentRegistry


class DummyAgent(BaseAgent):
    """Dummy agent for testing"""

    async def run(self, input_data):
        return {"result": "ok"}

    async def validate_input(self, input_data):
        return True


def test_register_agent():
    """Test agent registration"""
    AgentRegistry.register("dummy", DummyAgent)
    assert "dummy" in AgentRegistry.list_agents()


def test_get_agent():
    """Test getting agent by name"""
    AgentRegistry.register("dummy", DummyAgent)
    agent_class = AgentRegistry.get("dummy")
    assert agent_class == DummyAgent


def test_create_agent():
    """Test creating agent instance"""
    AgentRegistry.register("dummy", DummyAgent)
    config = AgentConfig(name="test", description="Test agent")
    agent = AgentRegistry.create("dummy", config)
    assert agent.name == "test"
    assert isinstance(agent, DummyAgent)


def test_create_unknown_agent():
    """Test creating unknown agent raises error"""
    with pytest.raises(ValueError):
        AgentRegistry.create("unknown", AgentConfig(name="test", description="test"))