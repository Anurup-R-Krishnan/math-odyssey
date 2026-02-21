from playwright.sync_api import Page, expect, sync_playwright

def test_game_modes_visible(page: Page):
    # Navigate to the root
    url = "http://localhost:8080/"
    print(f"Navigating to {url}")
    page.goto(url)

    print(f"Page title: {page.title()}")
    page.screenshot(path="verification/root.png")

    # Try navigating to /game
    url_game = "http://localhost:8080/game"
    print(f"Navigating to {url_game}")
    page.goto(url_game)
    print(f"Page title: {page.title()}")
    page.screenshot(path="verification/game_root.png")

    # Try /math-odyssey/game
    url_mo_game = "http://localhost:8080/math-odyssey/game"
    print(f"Navigating to {url_mo_game}")
    page.goto(url_mo_game)
    print(f"Page title: {page.title()}")
    page.screenshot(path="verification/game_mo.png")


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_game_modes_visible(page)
            print("Verification script ran successfully.")
        except Exception as e:
            print(f"Verification script failed: {e}")
            try:
                page.screenshot(path="verification/error.png")
            except:
                pass
            raise
        finally:
            browser.close()
