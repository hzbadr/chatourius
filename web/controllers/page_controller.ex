defmodule Chatourius.PageController do
  use Chatourius.Web, :controller

  # plug Coherence.Authentication.Session, [protected: true]

  def index(conn, _params) do
    render conn, "index.html"
  end
end
