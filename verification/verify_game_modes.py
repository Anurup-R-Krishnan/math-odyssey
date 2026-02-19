from playwright.sync_api import Page, expect, sync_playwright

def test_game_modes_visible(page: Page):
    # Navigate to the game page
    url = "http://localhost:8080/game"
    print(f"Navigating to {url}")
    page.goto(url)

    # Check if "Choose Your Mission" text is visible
    expect(page.get_by_text("Choose Your Mission")).to_be_visible()

    # Check if all game modes are visible
    modes = [
        "Addition Station",
        "Subtraction Station",
        "Multiplication Magic",
        "Division Dash",
        "Fraction Fun",
        "Pattern Station"
    ]

    for mode in modes:
        print(f"Checking visibility of mode: {mode}")
        expect(page.get_by_text(mode)).to_be_visible()

    # Take a screenshot
    output_path = "verification/verification.png"
    page.screenshot(path=output_path)
    print(f"Screenshot saved to {output_path}")

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
