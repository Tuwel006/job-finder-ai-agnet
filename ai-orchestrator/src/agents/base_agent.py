"""Base Agent class for all AI agents"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class AgentConfig(BaseModel):
    """Configuration for an agent"""
    name: str
    description: str
    tools: list[str] = Field(default_factory=list)


class BaseAgent(ABC):
    """
    Abstract base class for all AI agents.

    Agents should inherit from this class and implement:
    - run(): Main execution logic
    - validate_input(): Input validation
    """

    def __init__(self, config: AgentConfig):
        self.config = config
        self.name = config.name
        self.description = config.description
        self.tools = config.tools

    @abstractmethod
    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main agent execution method.

        Args:
            input_data: Dictionary containing input parameters

        Returns:
            Dictionary containing execution results
        """
        pass

    @abstractmethod
    async def validate_input(self, input_data: Dict[str, Any]) -> bool:
        """
        Validate input data before processing.

        Args:
            input_data: Dictionary containing input parameters

        Returns:
            True if valid, False otherwise
        """
        pass

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name}>"