use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    Manager,
};

#[cfg(windows)]
use winreg::{enums::HKEY_CURRENT_USER, RegKey};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(windows)]
fn get_run_key() -> Result<RegKey, String> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    hkcu.open_subkey_with_flags(
        "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
        winreg::enums::KEY_WRITE | winreg::enums::KEY_READ,
    )
    .map_err(|e| format!("无法打开注册表：{}", e))
}

#[cfg(windows)]
fn get_app_path() -> Result<String, String> {
    std::env::current_exe()
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| format!("无法获取应用路径：{}", e))
}

#[cfg(windows)]
#[tauri::command]
fn enable_autostart(_app: tauri::AppHandle) -> Result<bool, String> {
    let run_key = get_run_key()?;
    let app_path = get_app_path()?;
    run_key
        .set_value("count-day", &app_path)
        .map_err(|e| format!("写入注册表失败：{}", e))?;
    Ok(true)
}

#[cfg(windows)]
#[tauri::command]
fn disable_autostart(_app: tauri::AppHandle) -> Result<bool, String> {
    let run_key = get_run_key()?;
    run_key
        .delete_value("count-day")
        .or_else(|e| {
            // 如果值不存在，也视为成功
            if e.kind() == std::io::ErrorKind::NotFound {
                Ok(())
            } else {
                Err(e)
            }
        })
        .map_err(|e| format!("删除注册表项失败：{}", e))?;
    Ok(true)
}

#[cfg(windows)]
#[tauri::command]
fn is_autostart_enabled(_app: tauri::AppHandle) -> Result<bool, String> {
    let run_key = get_run_key()?;
    let app_path = get_app_path()?;
    
    match run_key.get_value::<String, _>("count-day") {
        Ok(val) => Ok(val == app_path),
        Err(e) => {
            if e.kind() == std::io::ErrorKind::NotFound {
                Ok(false)
            } else {
                Err(format!("读取注册表失败：{}", e))
            }
        }
    }
}

#[cfg(not(windows))]
#[tauri::command]
fn enable_autostart(_app: tauri::AppHandle) -> Result<bool, String> {
    Err("自启动功能仅支持 Windows".to_string())
}

#[cfg(not(windows))]
#[tauri::command]
fn disable_autostart(_app: tauri::AppHandle) -> Result<bool, String> {
    Err("自启动功能仅支持 Windows".to_string())
}

#[cfg(not(windows))]
#[tauri::command]
fn is_autostart_enabled(_app: tauri::AppHandle) -> Result<bool, String> {
    Err("自启动功能仅支持 Windows".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            // 当已有实例运行时，聚焦到现有窗口
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .invoke_handler(tauri::generate_handler![
            greet,
            enable_autostart,
            disable_autostart,
            is_autostart_enabled
        ]);

    builder
        .setup(|app| {
            let show_mi = MenuItem::with_id(app, "show", "显示主窗口", true, None::<&str>)?;
            let quit_mi = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_mi, &quit_mi])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, _event| {
            // 事件处理已在 single_instance 插件中处理
        });
}
