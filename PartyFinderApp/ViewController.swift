//
//  ViewController.swift
//  PartyFinderApp
//
//  Created by Mohit on 23/02/19.
//  Copyright © 2019 Mohit D. All rights reserved.
//

import UIKit
import SCSDKLoginKit


class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    @IBAction func snapchatLoginAction(_ sender: UIButton) {
        SCSDKLoginClient.login(from: self) { success, error in
            if let error = error {
                // An error occurred during the login process
                print(error.localizedDescription)
            } else {
                // The login was a success! This user is now
                // authenticated with Snapchat!
            }
        }    }
    
}

