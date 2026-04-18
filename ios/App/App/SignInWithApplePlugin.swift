import Foundation
import Capacitor
import AuthenticationServices

@objc(SignInWithApple)
public class SignInWithApple: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SignInWithApple"
    public let jsName = "SignInWithApple"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authorize", returnType: CAPPluginReturnPromise),
    ]

    private var savedCall: CAPPluginCall?

    @objc func authorize(_ call: CAPPluginCall) {
        self.savedCall = call
        self.bridge?.saveCall(call)

        let provider = ASAuthorizationAppleIDProvider()
        let request = provider.createRequest()

        if let scopes = call.getString("scopes") {
            var s: [ASAuthorization.Scope] = []
            if scopes.contains("name") { s.append(.fullName) }
            if scopes.contains("email") { s.append(.email) }
            if !s.isEmpty { request.requestedScopes = s }
        }
        request.state = call.getString("state")
        request.nonce = call.getString("nonce")

        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.performRequests()
    }
}

extension SignInWithApple: ASAuthorizationControllerDelegate {
    public func authorizationController(controller: ASAuthorizationController,
                                        didCompleteWithAuthorization authorization: ASAuthorization) {
        guard
            let cred = authorization.credential as? ASAuthorizationAppleIDCredential,
            let call = savedCall,
            let tokenData = cred.identityToken,
            let token = String(data: tokenData, encoding: .utf8)
        else { return }

        var authCode: String? = nil
        if let codeData = cred.authorizationCode {
            authCode = String(data: codeData, encoding: .utf8)
        }

        call.resolve([
            "response": [
                "user": cred.user,
                "email": cred.email as Any,
                "givenName": cred.fullName?.givenName as Any,
                "familyName": cred.fullName?.familyName as Any,
                "identityToken": token,
                "authorizationCode": authCode as Any
            ]
        ])
        self.bridge?.releaseCall(withID: call.callbackId)
        savedCall = nil
    }

    public func authorizationController(controller: ASAuthorizationController,
                                        didCompleteWithError error: Error) {
        guard let call = savedCall else { return }
        call.reject(error.localizedDescription)
        self.bridge?.releaseCall(withID: call.callbackId)
        savedCall = nil
    }
}
