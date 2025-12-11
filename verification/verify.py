from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_selector("text=Campaign Settings", timeout=10000)
            print("Campaign Settings loaded.")

            # Take screenshot of Campaign Step
            page.screenshot(path="verification/1_campaign_step.png")
            print("Screenshot 1 taken.")

            # Test Navigation
            page.click("text=Next: Ad Set")
            page.wait_for_selector("text=Ad Set Settings")
            page.screenshot(path="verification/2_ad_set_step.png")
            print("Screenshot 2 taken.")

            page.click("text=Next: Ad Creative")
            page.wait_for_selector("text=Ad Creative")
            page.screenshot(path="verification/3_ad_step.png")
            print("Screenshot 3 taken.")

            page.click("text=Next: Review")
            page.wait_for_selector("text=Review & Launch")
            page.screenshot(path="verification/4_review_step.png")
            print("Screenshot 4 taken.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
