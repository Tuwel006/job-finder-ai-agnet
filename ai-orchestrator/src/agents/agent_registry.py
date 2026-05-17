"""Agent Registry for managing agent instances"""

from typing import Dict, Type, Optional

from .base_agent import BaseAgent, AgentConfig


class AgentRegistry:
    """
    Singleton registry for managing agent classes.

    Agents register themselves with the registry and can be
    retrieved by name later.

    Usage:
        # Register an agent
        AgentRegistry.register("resume_parser", ResumeParserAgent)

        # Get an agent class
        agent_class = AgentRegistry.get("resume_parser")

        # Create an instance
        agent = agent_class(config)
    """

    _agents: Dict[str, Type[BaseAgent]] = {}

    @classmethod
    def register(cls, name: str, agent_class: Type[BaseAgent]) -> None:
        """
        Register an agent class with the registry.

        Args:
            name: Unique name for the agent
            agent_class: The agent class to register
        """
        cls._agents[name] = agent_class

    @classmethod
    def get(cls, name: str) -> Optional[Type[BaseAgent]]:
        """
        Get an agent class by name.

        Args:
            name: Name of the agent

        Returns:
            Agent class or None if not found
        """
        return cls._agents.get(name)

    @classmethod
    def list_agents(cls) -> list[str]:
        """List all registered agent names"""
        return list(cls._agents.keys())

    @classmethod
    def create(cls, name: str, config: AgentConfig) -> BaseAgent:
        """
        Create an agent instance by name.

        Args:
            name: Name of the agent
            config: Agent configuration

        Returns:
            Agent instance

        Raises:
            ValueError: If agent not found
        """
        agent_class = cls.get(name)
        if not agent_class:
            available = cls.list_agents()
            raise ValueError(f"Agent not found: {name}. Available: {available}")
        return agent_class(config)