package com.cloudsketch.whiteboard.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authToken = accessor.getFirstNativeHeader("Authorization");
            
            if (authToken != null && authToken.startsWith("Bearer ")) {
                String jwt = authToken.substring(7);
                
                if (jwt.startsWith("guest.")) {
                    String guestUsername = extractGuestUsername(jwt);
                    if (guestUsername != null) {
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(guestUsername, null, java.util.Collections.emptyList());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        accessor.setUser(authentication);
                    } else {
                        throw new RuntimeException("Invalid guest token");
                    }
                } else if (jwtUtils.validateJwtToken(jwt)) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    accessor.setUser(authentication);
                } else {
                    throw new RuntimeException("Invalid JWT token");
                }
            } else {
                throw new RuntimeException("Missing or invalid Authorization header");
            }
        }
        
        return message;
    }
    

    private String extractGuestUsername(String guestToken) {
        try {
            String encodedData = guestToken.substring(6);
            String decodedData = new String(java.util.Base64.getDecoder().decode(encodedData));
            if (decodedData.contains("\"username\":")) {
                int start = decodedData.indexOf("\"username\":\"") + 12;
                int end = decodedData.indexOf("\"", start);
                if (start > 11 && end > start) {
                    return decodedData.substring(start, end);
                }
            }
        } catch (Exception e) {
        }
        return null;
    }
}
