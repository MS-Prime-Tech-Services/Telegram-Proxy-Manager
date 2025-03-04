from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.core.clipboard import Clipboard
from kivy.clock import Clock
from kivy.metrics import dp
from kivy.uix.spinner import Spinner
from kivy.uix.webview import WebView
from utils import parse_proxy_links
import webbrowser
import os

class ProxyLayout(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = dp(20)
        self.spacing = dp(15)

        # Initialize proxy list
        self.proxy_links = []
        self.load_proxy_links()

        # Ad Banner using WebView (728x90)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        ad_html_path = os.path.join(current_dir, 'static', 'ads.html')
        self.ad_webview = WebView(
            size_hint_y=None,
            height=dp(90)
        )
        self.ad_webview.load_url('file://' + ad_html_path)

        # Title with styling
        title = Label(
            text='Telegram Proxy Manager',
            font_size=dp(24),
            size_hint_y=None,
            height=dp(40),
            bold=True
        )

        # Status spinner for loading
        self.status_spinner = Spinner(
            text='Loading...',
            values=['Loading...'],
            size_hint_y=None,
            height=dp(30),
            opacity=0
        )

        # Create info labels with better styling
        self.server_label = Label(
            text='Server: -',
            size_hint_y=None,
            height=dp(30),
            halign='left'
        )
        self.port_label = Label(
            text='Port: -',
            size_hint_y=None,
            height=dp(30),
            halign='left'
        )
        self.country_label = Label(
            text='Country: -',
            size_hint_y=None,
            height=dp(30),
            halign='left'
        )

        # Secret box with copy button
        self.secret_box = BoxLayout(
            orientation='horizontal',
            spacing=dp(10),
            size_hint_y=None,
            height=dp(40)
        )
        self.secret_input = TextInput(
            readonly=True,
            multiline=False,
            font_name='RobotoMono'
        )
        self.copy_button = Button(
            text='Copy',
            size_hint_x=0.3,
            background_color=(0.2, 0.6, 1, 1),
            on_press=self.copy_secret
        )
        self.secret_box.add_widget(self.secret_input)
        self.secret_box.add_widget(self.copy_button)

        # Action buttons
        self.generate_button = Button(
            text='Generate New Proxy',
            size_hint_y=None,
            height=dp(50),
            background_color=(0.2, 0.7, 0.3, 1),
            on_press=self.generate_proxy
        )

        self.open_button = Button(
            text='Open in Telegram',
            size_hint_y=None,
            height=dp(50),
            background_color=(0.1, 0.4, 0.8, 1),
            on_press=self.open_proxy,
            disabled=True
        )

        # Add all widgets to layout
        self.add_widget(self.ad_webview)  # Add ad webview at the top
        self.add_widget(title)
        self.add_widget(self.status_spinner)
        self.add_widget(self.server_label)
        self.add_widget(self.port_label)
        self.add_widget(self.country_label)
        self.add_widget(Label(text='Secret:', size_hint_y=None, height=dp(30), halign='left'))
        self.add_widget(self.secret_box)
        self.add_widget(self.generate_button)
        self.add_widget(self.open_button)

        # Current proxy data
        self.current_proxy = None

        # Schedule ad refresh
        Clock.schedule_interval(self.refresh_ad, 300)  # Refresh ad every 5 minutes

    def refresh_ad(self, dt):
        """Refresh the ad banner"""
        self.ad_webview.reload()

    def load_proxy_links(self):
        try:
            with open('attached_assets/Pasted--p-id-mtproto-a-href-tg-proxy-server-157-240-22-2-amp-port-443-amp-secret-ee000000000000000000-1741088608550.txt', 'r', encoding='utf-8') as f:
                content = f.read()
                self.proxy_links = parse_proxy_links(content)
                print(f"Loaded {len(self.proxy_links)} proxies")
        except Exception as e:
            print(f"Error loading proxy links: {e}")
            self.proxy_links = []

    def show_loading(self, show=True):
        self.status_spinner.opacity = 1 if show else 0
        self.generate_button.disabled = show

    def generate_proxy(self, instance):
        if not self.proxy_links:
            self.show_loading(True)
            Clock.schedule_once(lambda dt: self.load_and_show_proxy(), 0.5)
        else:
            self.show_proxy()

    def load_and_show_proxy(self):
        self.load_proxy_links()
        self.show_loading(False)
        if self.proxy_links:
            self.show_proxy()
        else:
            self.generate_button.text = 'Retry Loading'

    def show_proxy(self):
        if not self.proxy_links:
            return

        # Get first proxy and rotate
        self.current_proxy = self.proxy_links[0]
        self.proxy_links.append(self.proxy_links.pop(0))

        # Update UI with animation
        def update_labels(dt):
            self.server_label.text = f"Server: {self.current_proxy['server']}"
            self.port_label.text = f"Port: {self.current_proxy['port']}"
            self.country_label.text = f"Country: {self.current_proxy['country']}"
            self.secret_input.text = self.current_proxy['secret']
            self.open_button.disabled = False

        Clock.schedule_once(update_labels, 0.1)

    def copy_secret(self, instance):
        if self.secret_input.text:
            Clipboard.copy(self.secret_input.text)
            original_text = instance.text
            instance.text = 'Copied!'
            instance.background_color = (0.2, 0.8, 0.2, 1)  # Green

            def restore_button(dt):
                instance.text = original_text
                instance.background_color = (0.2, 0.6, 1, 1)  # Original color

            Clock.schedule_once(restore_button, 1.5)

    def open_proxy(self, instance):
        if self.current_proxy:
            webbrowser.open(self.current_proxy['full_url'])

class ProxyApp(App):
    def build(self):
        return ProxyLayout()

if __name__ == '__main__':
    ProxyApp().run()