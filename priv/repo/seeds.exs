# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Chatourius.Repo.insert!(%Chatourius.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Chatourius.Repo.delete_all Chatourius.User

Chatourius.User.changeset(%Chatourius.User{}, %{name: "Test User", email: "test1@example.com", password: "1234", password_confirmation: "1234"})
|> Chatourius.Repo.insert!
